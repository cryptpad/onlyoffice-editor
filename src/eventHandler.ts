export class EventHandler<T> {
    private handler?: (e: T) => void;
    private queue: T[];
    private debug: string;

    constructor(debug?: string) {
        this.handler = undefined;
        this.queue = [];
        this.debug = debug;
    }

    setHandler(handler: (e: T) => void) {
        this.handler = this.debug
            ? (e: T) => {
                  console.log(this.debug, e);
                  handler(e);
              }
            : handler;
        if (this.queue.length > 0) {
            for (const e of this.queue) {
                this.handler(e);
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
