import { FN } from "./operation";

export const defaultOperations: FN[] = [
    and,
    or,
    not,
    test,
    expand,
];

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

export function expand(a: boolean) : boolean[] {
    return [a, a, a];
}