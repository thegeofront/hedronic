export function tryFilter<T>(array: T[], predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any) {
    let l = array.filter(predicate);
    if (l.length == 0) {
        return undefined;
    } else {
        return l[0];
    }
}