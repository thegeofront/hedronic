import { FunctionShim } from "../../../../modules/shims/function-shim";
import { TypeShim } from "../../../../modules/shims/type-shim";
import { Type } from "../../../../modules/types/type";
import { MapTree } from "../../../maptree";
import { Divider, divider, func } from "../../../std-system";
import { Random } from "../random";
import { Range1 } from "./range-1";

export class Range3 {
    
    private constructor(
        public xmin: number,
        public xmax: number,
        public ymin: number,
        public ymax: number,
        public zmin: number,
        public zmax: number,
    ) {}

    static new(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number) {
        return new Range3(xmin, xmax, ymin, ymax, zmin, zmax);
    }

    static fromRanges(x: Range1, y: Range1, z: Range1) {
        return new Range3(x.min, x.max, y.min, y.max, z.min, z.max);
    }

    static fromRadius(radius: number) {
        return new Range3(
            -radius, radius, 
            -radius, radius, 
            -radius, radius)
    }

    static fromRadii(xradius: number, yradius: number, zradius: number) {
        return new Range3(-xradius, xradius, -yradius, yradius, -zradius, zradius)
    }

    //////////////

    static spawn(rng: Random, count: number) {
        
    }

    //////////////

    static readonly TypeShim = TypeShim.new("range-3", Type.Object, undefined, [
        TypeShim.new("xmin", Type.number),
        TypeShim.new("xmax", Type.number),
        TypeShim.new("ymin", Type.number),
        TypeShim.new("ymax", Type.number),
        TypeShim.new("zmax", Type.number),
        TypeShim.new("zmax", Type.number),
    ]);

    static _reference(nickname: string) {
        return TypeShim.new(nickname, Type.Reference, undefined, [Range3.TypeShim]);
    }


    static readonly Functions = MapTree.new<FunctionShim | Divider>([
        func("Range3", Range3.new),
        func("Range3 from ranges", Range3.fromRanges),
        func("Range3 from radius", Range3.fromRadius),
        func("Range3 from radii", Range3.fromRadii),
        divider(),
    ]); 
}

// export const Range3Type = TypeShim.new("range-3", Type.Object, undefined, [
//     newRange1Type("x"),
//     newRange1Type("y"),
//     newRange1Type("z"),
// ]);

// export function newRange3Type(name: string) {
//     return TypeShim.new(name, Type.Reference, undefined, [Range3Type]);
// }

// export function newRange3(x: Range1, y: Range1, z: Range1) : Range3 {
//     return {trait: "range-3", x, y, z};
// }
