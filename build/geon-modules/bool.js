export function AND(a, b) { 
    return a && b;
}

export function NOT(a) {
    return !a;
}

export function OR(a, b) { 
    return a || b;
}

export function NAND(a, b) { 
    let [c] = GEON.AND(a, b);
    let [d] = GEON.NOT(c);
    return d; 
}

export function XOR(a, b) { 
    let [c] = GEON.NAND(a, b);
    let [d] = GEON.OR(a, b);
    let [e] = GEON.AND(c, d); 
    return e; 
}