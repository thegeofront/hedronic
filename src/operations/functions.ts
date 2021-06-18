import { FN } from "./operation";

export const defaultOperations: FN[] = [
    IN,
    OUT,
    AND,
    OR,
    NOT,
    MULTI,
    EXPAND,
];

export function IN() : boolean[] { 
    return [true];
}

export function OUT(a: boolean) : boolean[] { 
    return [];
}

export function AND(a: boolean, b: boolean) : boolean[] { 
    return [a && b];
}

export function OR(a: boolean, b: boolean) : boolean[] { 
    return [a || b];
}

export function NOT(a: boolean) : boolean[] {
    return [!a];
}

export function MULTI(a: boolean, b: boolean, c: boolean) : boolean[] {
    return [a, b];
}

export function EXPAND(a: boolean) : boolean[] {
    return [a, a, a, a, a, a];
}