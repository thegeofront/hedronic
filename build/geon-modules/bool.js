export function AND(a, b) { 
    return [a && b];
}

export function NOT(a) {
    return [!a];
}

export function OR(a, b) { 
    return [a || b];
}

export function NAND(a, b) { 
    let [c] = bool.AND(a, b);
    let [d] = bool.NOT(c);
    return [d]; 
}

export function XOR(a, b) { 
    let [c] = bool.NAND(a, b);
    let [d] = bool.OR(a, b);
    let [e] = bool.AND(c, d); 
    return [e]; 
}