export function and(a: boolean, b: boolean) : boolean[] { 
    return [a && b];
}

export function or(a: boolean, b: boolean) : boolean[] { 
    return [a || b];
}

export function not(a: boolean) : boolean[] {
    return [!a];
}

export function test(a: boolean, b: boolean, c: boolean) : boolean[] {
    return [a == b, a == c];
}