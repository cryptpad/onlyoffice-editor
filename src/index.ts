import { EventHandler } from "./eventHandler";
import { deepAssign, noop, waitForEvent } from "./utils";
import { mkEvent, createChannel } from "./worker-channel";

let DocEditorOrig: any;

async function loadAndPatchOOOrig() {
    let myScriptSrc: string;
    let myScriptElement: HTMLScriptElement;

    // TODO document.currentScript does not reaturn the correct tag?
    // Use this as a workaround:
    for(const e of document.getElementsByTagName('script')) {
        if (e.src.endsWith('web-apps/apps/api/documents/api.js')) {
            myScriptSrc = e.src;
            myScriptElement = e;
            break;
        }
    }
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute(
        "src",
        new URL(
            "api-orig.js",
            myScriptSrc,
        ).href,
    );
    const scriptLoadedPromise = waitForEvent(script, "load");
    myScriptElement.after(script);
    await scriptLoadedPromise;

    const w = window as any;
    DocEditorOrig = w.DocsAPI.DocEditor;
    w.DocsAPI.DocEditor = DocEditor;
}

const scriptLoadedPromise = loadAndPatchOOOrig();

export class DocEditor implements DocEditorInterface {
    public waitForAppReady: Promise<void>;
    private origEditor?: DocEditorInterface;
    private fromOOHandler: EventHandler<FromOO> = new EventHandler();
    private toOOHandler: EventHandler<ToOO> = new EventHandler();
    private placeholderId: string;

    constructor(placeholderId: string, config: any) {
        this.placeholderId = placeholderId;

        this.init(config).catch((e) => {
            // TODO not sure, what to do here
            console.error(e);
        });
    }

    private async init(config: any) {
        await scriptLoadedPromise;
        let onAppReady;

        this.waitForAppReady = new Promise((resolve) => {
            onAppReady = resolve;
        });

        this.waitForAppReady
            .then(config?.events?.onAppReady ?? noop)
            .catch(noop);

        const newConfig = deepAssign(config, { events: { onAppReady } });

        this.origEditor = new DocEditorOrig(this.placeholderId, newConfig);

        // TODO how do I do this?
        // w.DocsAPI.DocEditorOrig = w.DocsAPI.DocEditor;
        // w.DocsAPI = this.createProxy(w.DocsAPI);

        const w = window as any;
        w.APP = w.APP ?? {};
        w.APP.setToOOHandler = (h: (e: ToOO) => void) => {
            this.toOOHandler.setHandler(h);
        };
        w.APP.sendMessageFromOO = (msg: FromOO) => {
            this.fromOOHandler.fire(msg);
        };
    }

    installLegacyChannel() {
        const msgEv = mkEvent();
        const iframe = this.getIframe().contentWindow;
        window.addEventListener("message", (msg) => {
            if (msg.source !== iframe) {
                return;
            }
            msgEv.fire(msg);
        });
        const postMsg = (data: any) => {
            iframe.postMessage(data);
        };
        createChannel(msgEv, postMsg, (chan: any) => {
            this.toOOHandler.setHandler((obj: ToOO) => {
                chan.event("CMD", obj);
            });

            chan.on("CMD", (e: FromOO) => {
                this.fromOOHandler.fire(e);
            });
        });
    }

    destroyEditor() {
        this.origEditor.destroyEditor();
    }

    getIframe(): HTMLIFrameElement {
        return document.querySelector('iframe[name="frameEditor"]');
    }

    injectCSS(css: string) {
        const head = this.getIframe().contentDocument.querySelector("head");
        const style = document.createElement("style");
        style.innerText = css;
        head.appendChild(style);
    }

    sendMessageToOO(msg: ToOO) {
        this.toOOHandler.fire(msg);
    }

    setOnMessageFromOOHandler(onMessage: (e: FromOO) => void) {
        this.fromOOHandler.setHandler(onMessage);
    }
}

type FromOO = any;
type ToOO = any;

interface DocEditorInterface {
    destroyEditor(): void;
}
