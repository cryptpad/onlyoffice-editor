export class EventHandler<T> {
    private handlers: Map<number, (e: T) => void>;
    private counter = 0;
    private queue: T[];
    private debug: string;

    constructor(debug?: string) {
        this.handlers = new Map();
        this.queue = [];
        this.debug = debug;
    }

    addHandler(handler: (e: T) => void): HandlerHandle<T> {
        const h = this.debug
            ? (e: T) => {
                  console.log(this.debug, e);
                  handler(e);
              }
            : handler;
        const id = this.counter;
        this.counter++;
        this.handlers.set(id, h);

        if (this.queue.length > 0) {
            for (const e of this.queue) {
                this.callHandlers(e);
            }
            this.queue = [];
        }
        return new HandlerHandle(this.handlers, id);
    }

    fire(e: T) {
        if (this.handlers.size > 0) {
            this.callHandlers(e);
        } else {
            this.queue.push(structuredClone(e));
        }
    }

    private callHandlers(e: T) {
        for (const h of this.handlers.values()) {
            // We to not know, if sender or receiver will modify the event, so we
            // clone it. At least OnlyOffice modifies events in some cases.
            const clone = structuredClone(e);
            setTimeout(() => h(clone));
        }
    }
}

export class HandlerHandle<T> {
    private handlers: Map<number, (e: T) => void>;
    private id: number;

    constructor(handlers: Map<number, (e: T) => void>, id: number) {
        this.handlers = handlers;
        this.id = id;
    }

    remove() {
        this.handlers.delete(this.id);
    }
}
