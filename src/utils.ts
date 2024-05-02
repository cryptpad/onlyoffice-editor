export function deepAssign<T, U>(target: T | undefined, source: U): T & U {
    const t: any = target; // disable type checks in this implementation
    const s: any = source;

    if (typeof t != "object") {
        return s;
    }

    const result = Object.assign({}, t);
    for (const key of Object.keys(s)) {
        result[key] = deepAssign(t[key], s[key]);
    }
    return result;
}

export function noop() {}

export function waitForEvent(
    element: Element,
    eventType: string,
): Promise<void> {
    return new Promise((resolve) => {
        element.addEventListener(eventType, () => resolve(), { once: true });
    });
}
