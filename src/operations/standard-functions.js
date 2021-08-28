export const StandardFunctions = [
    AND,
    OR,
    NOT,
    NAND,
    XOR,
    TEST,
]

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
    let [c] = GEON.AND(a, b);
    let [d] = GEON.NOT(c);
    return [d]; 
}

export function XOR(a, b) { 
    let [c] = GEON.NAND(a, b);
    let [d] = GEON.OR(a, b);
    let [e] = GEON.AND(c, d); 
    return [e]; 
}


export function TEST(a /* widget: button  x: 3 | y: 3 */,b /* widget: button  x: 5 | y: 5 */
) {
    let [c] = GEON.OR(b, a); /* x: 10 | y: 10 */
    let [d] = GEON.NOT(b); /* x: 10 | y: 10 */
    let [e] = GEON.AND(d, c); /* x: 15 | y: 15 */
    return [e /* widget: output  x: 20 | y: 20 */];
}

// export function MULTI(a: State, b: State, c: State) : State[] {
//     return [a, b];
// }

// export function EXPAND(a: State) : State[] {
//     return [a, a, a, a, a, a];
// }

