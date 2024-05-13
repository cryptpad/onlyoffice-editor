function mkTxid() {
    return (
        Math.random().toString(16).replace("0.", "") +
        Math.random().toString(16).replace("0.", "")
    );
}

// If once is true, after the event has been fired, any further handlers which are
// registered will fire immediately, and this type of event cannot be fired twice.
function mkEvent(once: boolean): MkEvent {
    const handlers: any[] = [];
    let fired = false;
    return {
        reg: function (cb: (p: any) => void): void {
            if (once && fired) {
                return void setTimeout(cb);
            }
            handlers.push(cb);
        },
        unreg: function (cb: any): void {
            if (handlers.indexOf(cb) === -1) {
                return void console.log(
                    "event handler was already unregistered",
                );
            }
            handlers.splice(handlers.indexOf(cb), 1);
        },
        fire: function (...args: any[]): void {
            if (once && fired) {
                return;
            }
            fired = true;
            handlers.forEach((h) => {
                h(...args);
            });
        },
    };
}

interface MkEvent {
    reg(cb: any): void;
    unreg(cb: any): void;
    fire(...args: any[]): void;
}

export function create(onMsg: MkEvent, postMsg: (p: any) => void, cb: any) {
    let chanLoaded = false;
    const waitingData: any[] = [];

    const evReady = mkEvent(true);

    onMsg.reg(function (msg: any) {
        if (chanLoaded) {
            return;
        }
        const data = msg.data;
        if (data === "_READY") {
            postMsg("_READY");
            chanLoaded = true;
            evReady.fire();
            waitingData.forEach(function (d) {
                onMsg.fire(d);
            });
            return;
        }
        waitingData.push(data);
    });

    const handlers: any = {};
    const queries: any = {};
    const acks: any = {};

    // list of handlers which are registered from the other side...
    const insideHandlers: any[] = [];
    const callWhenRegistered: any = {};

    const chan: any = {};

    // Send a query.  channel.query('Q_SOMETHING', { args: "whatever" }, function (reply) { ... });
    // We have a timeout for receiving an ACK, but unlimited time for receiving an answer to the query
    chan.query = function (q: any, content: any, cb: any, opts: any) {
        const txid = mkTxid();
        opts = opts || {};
        const to = opts.timeout || 30000;
        let timeout: any;
        if (to > 0) {
            timeout = setTimeout(function () {
                delete queries[txid];
                cb("TIMEOUT");
            }, to);
        }
        acks[txid] = function (err: any) {
            clearTimeout(timeout);
            delete acks[txid];
            if (err) {
                delete queries[txid];
                cb("UNHANDLED");
            }
        };
        queries[txid] = function (data: any, msg: any) {
            delete queries[txid];
            cb(undefined, data.content, msg);
        };
        evReady.reg(function () {
            const toSend = {
                txid: txid,
                content: content,
                q: q,
                raw: opts.raw,
            };
            postMsg(opts.raw ? toSend : JSON.stringify(toSend));
        });
    };

    // Fire an event.  channel.event('EV_SOMETHING', { args: "whatever" });
    const event = (chan.event = function (e: any, content: any, opts?: any) {
        opts = opts || {};
        evReady.reg(function () {
            const toSend = {
                content: content,
                q: e,
                raw: opts.raw,
            };
            postMsg(opts.raw ? toSend : JSON.stringify(toSend));
        });
    });

    // Be notified on query or event.  channel.on('EV_SOMETHING', function (args, reply) { ... });
    // If the type is a query, your handler will be invoked with a reply function that takes
    // one argument (the content to reply with).
    chan.on = function (queryType: any, handler: any, quiet: any) {
        const h = function (data: any, msg: any, raw: any) {
            handler(
                data.content,
                function (replyContent: any) {
                    const toSend = {
                        txid: data.txid,
                        content: replyContent,
                    };
                    postMsg(raw ? toSend : JSON.stringify(toSend));
                },
                msg,
            );
        };
        (handlers[queryType] = handlers[queryType] || []).push(h);
        if (!quiet) {
            event("EV_REGISTER_HANDLER", queryType);
        }
        return {
            stop: function () {
                const idx = handlers[queryType].indexOf(h);
                if (idx === -1) {
                    return;
                }
                handlers[queryType].splice(idx, 1);
            },
        };
    };

    // If a particular handler is registered, call the callback immediately, otherwise it will be called
    // when that handler is first registered.
    // channel.whenReg('Q_SOMETHING', function () { ...query Q_SOMETHING?... });
    chan.whenReg = function (queryType: any, cb: any, always: any) {
        let reg = always;
        if (insideHandlers.indexOf(queryType) > -1) {
            cb();
        } else {
            reg = true;
        }
        if (reg) {
            (callWhenRegistered[queryType] =
                callWhenRegistered[queryType] || []).push(cb);
        }
    };

    // Same as whenReg except it will invoke every time there is another registration, not just once.
    chan.onReg = function (queryType: any, cb: any) {
        chan.whenReg(queryType, cb, true);
    };

    chan.on("EV_REGISTER_HANDLER", function (content: any) {
        if (callWhenRegistered[content]) {
            callWhenRegistered[content].forEach(function (f: any) {
                f();
            });
            delete callWhenRegistered[content];
        }
        insideHandlers.push(content);
    });
    //chan.whenReg('EV_REGISTER_HANDLER', evReady.fire);

    // Make sure both iframes are ready
    let isReady = false;
    chan.onReady = function (h: any): void {
        if (isReady) {
            return void h();
        }
        if (typeof h !== "function") {
            return;
        }
        chan.on("EV_RPC_READY", function (): void {
            isReady = true;
            h();
        });
    };
    chan.ready = function () {
        chan.whenReg("EV_RPC_READY", function (): void {
            chan.event("EV_RPC_READY");
        });
    };

    onMsg.reg(function (msg: any): void {
        if (!chanLoaded) {
            return;
        }
        if (!msg.data || msg.data === "_READY") {
            return;
        }

        let data: any;
        // apparently some browser extensions send messages to random targets
        // which can trigger parse errors that interrupt normal behaviour
        // we therefore log a warning and ignore any messages we can't parse
        try {
            data =
                typeof msg.data === "object" ? msg.data : JSON.parse(msg.data);
        } catch (err) {
            console.warn(err);
            return;
        }
        if (typeof data.ack !== "undefined") {
            if (acks[data.txid]) {
                acks[data.txid](!data.ack);
            }
        } else if (typeof data.q === "string") {
            if (handlers[data.q]) {
                // If this is a "query", send an ack
                if (data.txid) {
                    postMsg(
                        JSON.stringify({
                            txid: data.txid,
                            ack: true,
                        }),
                    );
                }
                handlers[data.q].forEach(function (f: any) {
                    f(data || JSON.parse(msg.data), msg, data && data.raw);
                    data = undefined;
                });
            } else {
                if (data.txid) {
                    postMsg(
                        JSON.stringify({
                            txid: data.txid,
                            ack: false,
                        }),
                    );
                }
            }
        } else if (typeof data.q === "undefined" && queries[data.txid]) {
            queries[data.txid](data, msg);
        } else {
            /*console.log("DROP Unhandled message");
            console.log(msg.data, window);
            console.log(msg);*/
        }
    });

    postMsg("_READY");

    cb(chan);
}
