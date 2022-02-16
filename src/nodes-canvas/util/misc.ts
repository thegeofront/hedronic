export function tryFilter<T>(array: T[], predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any) {
    let l = array.filter(predicate);
    if (l.length == 0) {
        return undefined;
    } else {
        return l[0];
    }
}

export function mapmap<K, V, T>(map: Map<K, V>, mapper: (k: K, v: V) => T) {
    let mapped: T[] = [];
    for (let [k, v] of map) {
        mapped.push(mapper(k,v));
    }
    return mapped;
}