export function ADD(a, b) {
    return [a + b];
}

export function MUL(a, b) {
    return [a * b];
} 

export function POW(a, b) {
    let c = Math.pow(a, b);
    return [c];
}