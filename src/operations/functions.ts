import { GeonImage } from "../../../engine/src/lib";
import { State } from "../graph/state";

export function AND(a: State, b: State) : State[] { 
    return [a && b];
}

export function NOT(a: State) : State[] {
    return [!a];
}

export function OR(a: State, b: State) : State[] { 
    return [a || b];
}

export function NAND(a: State, b: State) : State[] { 
    //@ts-ignore
    return GEON.NOT(...GEON.AND(a, b)); 
}

export function XOR(a: State, b: State) : State[] { 
    //@ts-ignore
    return GEON.NOT(...GEON.AND(a, b)); 
}


// export function MULTI(a: State, b: State, c: State) : State[] {
//     return [a, b];
// }

// export function EXPAND(a: State) : State[] {
//     return [a, a, a, a, a, a];
// }

