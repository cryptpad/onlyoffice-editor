import { EventHandler } from "./eventHandler";
import { deepAssign, noop, waitForEvent } from "./utils";
import { mkEvent, createChannel } from "./worker-channel";

export class DocEditor implements DocEditorInterface {
    public waitForAppReady: Promise<void>;
    private editor?: DocEditorInterface;
    private fromOOHandler: EventHandler<FromOO> = new EventHandler();
    private toOOHandler: EventHandler<ToOO> = new EventHandler();
    private placeholderId: string;
    private scriptLoadedPromise: Promise<void>;

    constructor(placeholderId: string, config: any) {
        this.placeholderId = placeholderId;

        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute(
            "src",
            new URL(
                "api-orig.js",
                (document.currentScript as HTMLScriptElement).src,
            ).href,
        );
        this.scriptLoadedPromise = waitForEvent(script, "load");
        document.currentScript.after(script);
        this.init(config).catch((e) => {
            // TODO not sure, what to do here
            console.error(e);
        });
    }

    private async init(config: any) {
        await this.scriptLoadedPromise;
        let onAppReady;

        this.waitForAppReady = new Promise((resolve) => {
            onAppReady = resolve;
        });

        this.waitForAppReady
            .then(config?.events?.onAppReady ?? noop)
            .catch(noop);

        const newConfig = deepAssign(config, { events: { onAppReady } });

        const w = window as any;
        this.editor = new w.DocsAPI.DocEditor(this.placeholderId, newConfig);
        w.DocsAPIOrg = w.DocsAPI;
        w.DocsAPI = this.createProxy(w.DocsAPI);

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
        this.editor.destroyEditor();
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

    private createProxy(docsAPI: any) {
        return new Proxy(docsAPI, {
            get(target, prop, receiver) {
                if (Object.hasOwn(this, prop)) {
                    return this[prop];
                }
                return Reflect.get(target, prop, receiver);
            },
        });
    }
}

type FromOO = any;
type ToOO = any;

interface DocEditorInterface {
    destroyEditor(): void;
}
