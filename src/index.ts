import { EventHandler } from "./eventHandler";
import { deepAssign, noop, waitForEvent } from "./utils";

export class OnlyOfficeEditor<FROMOO, TOOO> {
    public waitForAppReady: Promise<void>;
    private editor?: DocEditor;
    private fromOOHandler: EventHandler<FROMOO> = new EventHandler();
    private toOOHandler: EventHandler<TOOO> = new EventHandler();
    private placeholderId: string;
    private scriptLoadedPromise: Promise<void>;

    constructor(placeholderId: string, apiUrl: string) {
        this.placeholderId = placeholderId;

        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', apiUrl);
        this.scriptLoadedPromise = waitForEvent(script, 'load');
        document.getElementById(placeholderId).after(script);
    }

    async init(config: any) {
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

        w.APP = w.APP ?? {};
        w.APP.setToOOHandler = (h: (e: TOOO) => void) => {
            this.toOOHandler.setHandler(h);
        };
        w.APP.sendMessageFromOO = (msg: FROMOO) => {
            this.fromOOHandler.fire(msg);
        };
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

    sendMessageToOO(msg: TOOO) {
        this.toOOHandler.fire(msg);
    }

    setOnMessageFromOOHandler(onMessage: (e: FROMOO) => void) {
        this.fromOOHandler.setHandler(onMessage);
    }
}

interface DocEditor {
    destroyEditor(): void;
}
