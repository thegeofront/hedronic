import { Domain, Triangulator } from "../../../../engine/src/lib";
import { FunctionShim } from "../../modules/shims/function-shim";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { newRange1Type, Range1 } from "../functions/math/range/range-1";

export function getSequencingFunctions(namespace="functions") {

    return [
        FunctionShim.newFromFunction(flatten, [namespace, "flatten"]),
        FunctionShim.newFromFunction(weave, [namespace, "weave"]),
        FunctionShim.new("remap", [namespace], remap, 
        [
            TypeShim.new("a", Type.number),
            newRange1Type("range-a"),
            newRange1Type("range-b"), 
        ], [TypeShim.new("b", Type.number)]),
        FunctionShim.new("new range", [namespace], range, 
        [
            TypeShim.new("start", Type.number),
            TypeShim.new("end", Type.number),

        ], [newRange1Type("range-1")]),
    ]; 
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

function range(min: number, max: number) : Range1 {
    return {trait: "range-1", min, max };
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

function remap(n: number, a: Range1, b: Range1) {
    return Domain.remap(n, a.min, a.max, b.min, b.max);
}