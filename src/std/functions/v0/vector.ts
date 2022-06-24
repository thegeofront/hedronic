import { FunctionShim } from "../../../modules/shims/function-shim";
import { JsType } from "../../../modules/types/type";
import { MapTree } from "../../../util/maptree";
import { Divider, shim, divider } from "../../std-system";

export class Vector {
    
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}

    static new(x=0.0, y=0.0, z=0.0) : Vector {
        return new Vector(x,y,z);
    }

    static fromArray(array: number[]) : Vector {
        return new Vector(array[0], array[1], array[2]);
    }

    static add(a: Vector, b: Vector) : Vector {
        return {
            x: a.x + b.x, 
            y: a.y + b.y, 
            z: a.z + b.z
        };
    }

    static readonly Functions = [
        shim(Vector.new, "Vector", "a 3D translation", 
            [JsType.number, JsType.number, JsType.number], 
            [JsType.Object]),
        shim(Vector.fromArray, "Vector from array", "Create a vector from the first 3 items of this list",
            [JsType.List], 
            [JsType.Object]),
        divider(),
    ];
}

// let vector3 = TypeShim.new("vector-3", Type.Object, undefined, [
//     TypeShim.new("x", Type.number),
//     TypeShim.new("y", Type.number),
//     TypeShim.new("z", Type.number)
// ]);

