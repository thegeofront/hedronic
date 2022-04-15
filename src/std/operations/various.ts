import { Domain, MultiVector3, Random, Triangulator, Vector2, Vector3 } from "../../../../engine/src/lib";
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

function randomPoints(hash: string, count: number) : any {
    
    let rng = Random.fromHash(hash);
    let points = new Array<Vector3>();
    for (let i = 0 ; i < count; i++) {
        points.push(Vector3.new(rng.get(), rng.get(), rng.get()))
    }
    return points;
}

function range(start: number, end: number) : Range1 {
    return {trait: "range-1", start, end };
}

