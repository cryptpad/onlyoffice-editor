export class EventHandler<T> {
    private handler?: (e: T) => void;
    private queue: T[];

    constructor() {
        this.handler = undefined;
        this.queue = [];
    }

    setHandler(handler: (e: T) => void) {
        this.handler = handler;
        if (this.queue.length > 0) {
            for (const e of this.queue) {
                console.log("XXX queue", e);
                handler(e);
            }
            this.queue = [];
        }
    }

    fire(e: T) {
        // We to not know, if sender or receiver will modify the event, so we
        // clone it. At least OnlyOffice modifies events in some cases.
        const clone = structuredClone(e);
        if (this.handler) {
            this.handler(clone);
        } else {
            this.queue.push(clone);
        }
    }
}
