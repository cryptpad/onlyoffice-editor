import { EventHandler } from "./eventHandler";
import { deepAssign, noop } from "./utils";

export class OnlyOfficeEditor<FROMOO, TOOO> {
    public waitForAppReady: Promise<void>;
    private editor?: DocEditor;
    private fromOOHandlers: EventHandler<FROMOO> = new EventHandler();
    private toOOHandlers: EventHandler<TOOO> = new EventHandler();

    constructor(placeholderId: string, apiUrl: string, config: any) {
        this.init(placeholderId, apiUrl, config);
    }

    init(placeholderId: string, apiUrl: string, config: any) {
        let onAppReady;

        this.waitForAppReady = new Promise((resolve) => {
            onAppReady = resolve;
        });

        this.waitForAppReady
            .then(config?.events?.onAppReady ?? noop)
            .catch(noop);

        const newConfig = deepAssign(config, { events: { onAppReady } });

        const w = window as any;
        this.editor = new w.DocsAPI.DocEditor(placeholderId, newConfig);

        w.APP = w.APP ?? {};
        w.APP.addToOOHandler = (h: (e: TOOO) => void) => {
            console.log("XXX addToOOHandler", h);
            this.toOOHandlers.setHandler(h);
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
        console.log("XXX sendMessageToOO", msg);
        this.toOOHandlers.fire(msg);
    }

    setOnMessageFromOOHandler(onMessage: (e: FROMOO) => void) {
        this.fromOOHandlers.setHandler(onMessage);
    }
}

interface DocEditor {
    destroyEditor(): void;
}
