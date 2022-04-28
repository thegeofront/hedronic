import { Vector2 } from "../../../../../engine/src/lib";

export interface Polyline2 {
    data: Vector2[]
}

// let multiLine3 = TypeShim.new("multi-line-3", Type.Object, undefined, [
//     TypeShim.new("vertices", Type.F32Buffer),
//     TypeShim.new("edges", Type.U16Buffer),
// ]);


export function newMultiLine3(data: Float32Array | Float64Array, lines: Uint16Array) {
    return {
        vertices: Float64Array.from(data),
        lines: Uint16Array.from(lines)
    };
}

