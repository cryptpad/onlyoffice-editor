import { deepAssign, noop } from "./utils.ts";

export function helloWorld() {
    console.log("XXX helloWorld!");
}

export class OnlyOfficeEditor {
    public waitForAppReady: Promise<void>;
    private editor: any;
    private fromOOHandlers: EventHandlers;
    private toOOHandlers: EventHandlers;

    constructor(placeholderId: string, config: any) {
        let onAppReady;

        this.waitForAppReady = new Promise((resolve) => {
            onAppReady = resolve;
        });

        this.waitForAppReady.then(config?.events?.onAppReady ?? noop);

        config = deepAssign(config, { events: { onAppReady } });

        const w = window as any;
        this.editor = new w.DocsAPI.DocEditor(placeholderId, config);

        this.fromOOHandlers = new EventHandlers();
        this.toOOHandlers = new EventHandlers();

        w.APP = w.APP || {};
        w.APP.addToOOHandler = (h) => {
            console.log("XXX addToOOHandler", h);
            this.toOOHandlers.add(h);
        };
    }

    destroyEditor() {
        this.editor.destroyEditor();
    }

    getIframe() {
        return document.querySelector('iframe[name="frameEditor"]');
    }

    injectCSS(css: string) {
        const head = this.getIframe().contentDocument.querySelector("head");
        const style = document.createElement("style");
        style.innerText = css;
        head.appendChild(style);
    }

    sendMessageToOO(msg) {
        console.log("XXX sendMessageToOO", msg);
        this.toOOHandlers.fire(msg);
    }

    addOnMessageFromOOHandler(onMessage) {
        this.fromOOHandlers.add(onMessage);
    }
}
