import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { F32Matrix, U16Matrix } from "../data/matrix";

export class Mesh {

    constructor(
        public points: F32Matrix,
        public links: U16Matrix,
    ) {}

    static readonly TypeShim = TypeShim.new("mesh-3", Type.Object, undefined, [
        TypeShim.new("vertices", Type.F32Buffer),
        TypeShim.new("triangles", Type.U16Buffer),
    ]);
}

export function newMesh(vertices: Float32Array | Float64Array, triangles: Uint16Array | Uint32Array ) {
    return {
        vertices: Float64Array.from(vertices), 
        triangles: Uint16Array.from(triangles),
    };
}