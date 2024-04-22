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
        if (this.handler) {
            this.handler(e);
        } else {
            console.log("XXX fire no handlers", e);
            this.queue.push(e);
        }
    }
}
