import { Domain, MultiVector3, Triangulator } from "../../../../engine/src/lib";
import { FunctionShim } from "../../modules/shims/function-shim";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { Range1, Range1Type } from "../types/math/range-1";

export function getVariousFunctions(namespace="various") {

    return [
        FunctionShim.newFromFunction(randomPoints, "randomPoints", namespace),
        // FunctionShim.newFromFunction(weave, "weave", namespace),
    ];
}

function randomPoints(rng: any, data: any[]) : any {
    // 
    // return flattened;
    return null;
}

function range(start: number, end: number) : Range1 {
    return {trait: "range-1", start, end };
}

