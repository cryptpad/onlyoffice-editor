import { EventHandler, HandlerHandle } from "./eventHandler";
import { deepAssign, noop, waitForEvent } from "./utils";
import { createChannel, mkEvent } from "./worker-channel";

let DocEditorOrig: any;

export class DocEditor implements DocEditorInterface {
    public waitForAppReady: Promise<void>;
    private origEditor?: DocEditorInterface;
    private fromOOHandler: EventHandler<FromOO> = new EventHandler("fromOO");
    private toOOHandler: EventHandler<ToOO> = new EventHandler("toOO");
    private placeholderId: string;
    private server: MockServer;
    private fromOOHandle?: HandlerHandle<FromOO>;

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

        const w = window as any;
        w.APP = w.APP ?? {};
        if (!w.APP.addToOOHandler) {
            w.APP.addToOOHandler = (h: (e: ToOO) => void) => {
                this.toOOHandler.addHandler(h);
            };
        }
        if (!w.APP.sendMessageFromOO) {
            w.APP.sendMessageFromOO = (msg: FromOO) => {
                this.fromOOHandler.fire(msg);
            };
        }
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
        this.fromOOHandle?.remove();
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

    connectMockServer(server: MockServer) {
        this.server = server;

        const w = window as any;
        w.APP.getImageURL = server.getImageURL
            ? (name: string, callback: (url: string) => void) => {
                  server
                      .getImageURL(name)
                      .then(callback)
                      .catch((e) => console.error(e));
              }
            : (name: string, callback: (url: string) => void) => callback("");

        this.fromOOHandle = this.fromOOHandler.addHandler((msg) => {
            if (msg.type == "auth") {
                this.handleAuth(msg);
            }
            this.server.onMessage(msg);
        });
    }

    private handleAuth(authMsg: FromOO) {
        // Answer to the auth command
        const initalChanges = this.server.getInitialChanges
            ? this.server.getInitialChanges()
            : [];
        const p = this.server.getParticipants();

        this.sendMessageToOO({
            type: "authChanges",
            changes: initalChanges,
        });

        this.sendMessageToOO({
            type: "auth",
            result: 1,
            sessionId: "session-id",
            participants: p.list,
            locks: [],
            changes: initalChanges,
            changesIndex: 0,
            indexUser: p.index,
            buildVersion: "5.2.6",
            buildNumber: 2,
            licenseType: 3,
        });

        // Open the document
        this.sendMessageToOO({
            type: "documentOpen",
            data: {
                type: "open",
                status: "ok",
                data: { "Editor.bin": authMsg.openCmd.url },
            },
        });

        if (this.server.onAuth) {
            this.server.onAuth();
        }
    }

    serviceCommand(command: string, data: any) {
        this.origEditor.serviceCommand(command, data);
    }

    showMessage(...args: any[]) {
        return this.origEditor.showMessage(...args);
    }
    processSaveResult(...args: any[]) {
        return this.origEditor.processSaveResult(...args);
    }
    processRightsChange(...args: any[]) {
        return this.origEditor.processRightsChange(...args);
    }
    denyEditingRights(...args: any[]) {
        return this.origEditor.denyEditingRights(...args);
    }
    refreshHistory(...args: any[]) {
        return this.origEditor.refreshHistory(...args);
    }
    setHistoryData(...args: any[]) {
        return this.origEditor.setHistoryData(...args);
    }
    setEmailAddresses(...args: any[]) {
        return this.origEditor.setEmailAddresses(...args);
    }
    setActionLink(...args: any[]) {
        return this.origEditor.setActionLink(...args);
    }
    processMailMerge(...args: any[]) {
        return this.origEditor.processMailMerge(...args);
    }
    downloadAs(...args: any[]) {
        return this.origEditor.downloadAs(...args);
    }
    attachMouseEvents(...args: any[]) {
        return this.origEditor.attachMouseEvents(...args);
    }
    detachMouseEvents(...args: any[]) {
        return this.origEditor.detachMouseEvents(...args);
    }
    setUsers(...args: any[]) {
        return this.origEditor.setUsers(...args);
    }
    showSharingSettings(...args: any[]) {
        return this.origEditor.showSharingSettings(...args);
    }
    setSharingSettings(...args: any[]) {
        return this.origEditor.setSharingSettings(...args);
    }
    insertImage(...args: any[]) {
        return this.origEditor.insertImage(...args);
    }
    setMailMergeRecipients(...args: any[]) {
        return this.origEditor.setMailMergeRecipients(...args);
    }
    setRevisedFile(...args: any[]) {
        return this.origEditor.setRevisedFile(...args);
    }
    setFavorite(...args: any[]) {
        return this.origEditor.setFavorite(...args);
    }
    requestClose(...args: any[]) {
        return this.origEditor.requestClose(...args);
    }
    grabFocus(...args: any[]) {
        return this.origEditor.grabFocus(...args);
    }
    blurFocus(...args: any[]) {
        return this.origEditor.blurFocus(...args);
    }
    setReferenceData(...args: any[]) {
        return this.origEditor.setReferenceData(...args);
    }
}

type FromOO = any;
type ToOO = any;

interface DocEditorInterface {
    showMessage(...args: any[]): any;
    processSaveResult(...args: any[]): any;
    processRightsChange(...args: any[]): any;
    denyEditingRights(...args: any[]): any;
    refreshHistory(...args: any[]): any;
    setHistoryData(...args: any[]): any;
    setEmailAddresses(...args: any[]): any;
    setActionLink(...args: any[]): any;
    processMailMerge(...args: any[]): any;
    downloadAs(...args: any[]): any;
    serviceCommand(command: string, data: any): void;
    attachMouseEvents(...args: any[]): any;
    detachMouseEvents(...args: any[]): any;
    destroyEditor(): void;
    setUsers(...args: any[]): any;
    showSharingSettings(...args: any[]): any;
    setSharingSettings(...args: any[]): any;
    insertImage(...args: any[]): any;
    setMailMergeRecipients(...args: any[]): any;
    setRevisedFile(...args: any[]): any;
    setFavorite(...args: any[]): any;
    requestClose(...args: any[]): any;
    grabFocus(...args: any[]): any;
    blurFocus(...args: any[]): any;
    setReferenceData(...args: any[]): any;
}

interface MockServer {
    getInitialChanges?: () => any[];
    getParticipants: () => Participants;
    getImageURL?: (name: string) => Promise<string>;
    onAuth?: () => void;
    onMessage: (msg: FromOO) => void;
}

interface Participants {
    index: number;
    list: [Participant];
}

interface Participant {
    id: number;
    idOriginal: string;
    username: string;
    indexUser: number;
    connectionId: string;
    isCloseCoAuthoring: boolean;
    view: boolean;
}

async function loadAndPatchOOOrig() {
    let myScriptSrc: string;
    let myScriptElement: HTMLScriptElement;

    // TODO document.currentScript does not return the correct tag?
    // Use this as a workaround:
    for (const e of document.getElementsByTagName("script")) {
        try {
            const pathname = new URL(e.src).pathname;
            if (pathname.endsWith("web-apps/apps/api/documents/api.js")) {
                myScriptSrc = e.src;
                myScriptElement = e;
                break;
            }
        } catch (error) {
            if (error instanceof TypeError) {
                // e.src is not a valid URL -> ignore
            } else {
                throw error;
            }
        }
    }
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", new URL("api-orig.js", myScriptSrc).href);
    const scriptLoadedPromise = waitForEvent(script, "load");

    myScriptElement.after(script);

    // Setup window.DocsAPI.DocEditor
    const w = window as any;
    w.DocsAPI = w.DocsAPI ?? {};
    w.DocsAPI.DocEditor = DocEditor;

    await scriptLoadedPromise;
    // Setup window.DocsAPI.DocEditor again after the original editor replaced it
    DocEditorOrig = w.DocsAPI.DocEditor;
    w.DocsAPI.DocEditor = DocEditor;
}

const scriptLoadedPromise = loadAndPatchOOOrig();
