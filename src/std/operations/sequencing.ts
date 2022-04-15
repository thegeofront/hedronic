import { Domain, Triangulator } from "../../../../engine/src/lib";
import { FunctionShim } from "../../modules/shims/function-shim";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { Range1, Range1Type } from "../types/math/range-1";

export function getSequencingFunctions(namespace="functions") {

    return [
        FunctionShim.newFromFunction(flatten, "flatten", namespace),
        FunctionShim.newFromFunction(weave, "weave", namespace),
        FunctionShim.new("remap", [namespace], remap, 
        [
            TypeShim.new("a", Type.number),
            TypeShim.new("Range A", Type.Reference, undefined, [Range1Type]),
            TypeShim.new("Range B", Type.Reference, undefined, [Range1Type]), 
        ], [TypeShim.new("b", Type.number)]),
        FunctionShim.new("new range", [namespace, "THINGIE"], range, 
        [
            TypeShim.new("start", Type.number),
            TypeShim.new("end", Type.number),

        ], [TypeShim.new("range", Type.Reference, undefined, [Range1Type])]),
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

function range(start: number, end: number) : Range1 {
    return {trait: "range-1", start, end };
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
    return Domain.remap(n, a.start, a.end, b.start, b.end);
}