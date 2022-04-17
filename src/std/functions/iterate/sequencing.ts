import { FunctionShim } from "../../../modules/shims/function-shim";
import { func } from "../../std-system";

export const SequencingFunctions = [
    func("Flat", flatten),
    func("Weave", weave),
];

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

function flatten(data: any[]) : any[] {
    let flattened = [];
    for (let item of data) {
        if (item.hasOwnProperty('trait')) {
            // console.log(item);
            flattened.push(item);
        } else if (item instanceof Array) {
            flattened.push(...flatten(item))
        }
    }
    return flattened;
}

