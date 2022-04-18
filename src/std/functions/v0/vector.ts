import { FunctionShim } from "../../../modules/shims/function-shim";
import { Type } from "../../../modules/types/type";
import { MapTree } from "../../maptree";
import { Divider, shim, divider } from "../../std-system";
import { Point } from "./point";

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

    static readonly Functions = MapTree.new<FunctionShim | Divider>([
        shim(Vector.new, "Vector", "a 3D translation", 
            [Type.number, Type.number, Type.number], 
            [Type.Object]),
        shim(Vector.fromArray, "Vector from array", "Create a vector from the first 3 items of this list",
            [Type.List], 
            [Type.Object]),
        divider(),
    ]);
}

// let vector3 = TypeShim.new("vector-3", Type.Object, undefined, [
//     TypeShim.new("x", Type.number),
//     TypeShim.new("y", Type.number),
//     TypeShim.new("z", Type.number)
// ]);

