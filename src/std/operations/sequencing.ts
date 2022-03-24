import { Triangulator } from "../../../../engine/src/lib";
import { FunctionShim } from "../../modules/shims/function-shim";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";

export function getSequencingFunctions(namespace="functions") {

    return [
        FunctionShim.newFromFunction(weave, "weave", namespace)
    ]; 
}

function weave(sequence: boolean[], a: any, b: any) {
    let c: any[] = [], d: any[] = [];
    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i]) {
            c.push(a);
            d.push(b);
        } else {
            c.push(b);
            d.push(a);
        }
    }
    return [c, d];
}