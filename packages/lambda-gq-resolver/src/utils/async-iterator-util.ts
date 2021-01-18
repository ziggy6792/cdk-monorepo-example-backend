/* eslint-disable no-restricted-syntax */
export async function toArray<T>(itr: AsyncIterableIterator<T>): Promise<T[]> {
    const out: T[] = [];
    for await (const x of itr) {
        out.push(x);
    }
    return out;
}

export async function waitForIterator<T>(itr: AsyncIterableIterator<T>): Promise<void> {
    for await (const x of itr) {
        // Do nothing
    }
}
