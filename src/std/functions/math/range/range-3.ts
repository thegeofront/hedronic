import { Domain } from "../../../../../../engine/src/lib";
import { FunctionShim } from "../../../../modules/shims/function-shim";
import { TypeShim } from "../../../../modules/shims/type-shim";
import { Type } from "../../../../modules/types/type";
import { MapTree } from "../../../maptree";
import { Divider, divider, func, shim } from "../../../std-system";
import { Point } from "../../v0/point";
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

    static new(xmin= 0.0, xmax = 1.0, ymin = 0.0, ymax = 1.0, zmin = 0.0, zmax = 1.0) {
        return new Range3(xmin, xmax, ymin, ymax, zmin, zmax);
    }

    static fromRanges(x: Range1, y: Range1, z: Range1) {
        return new Range3(x.min, x.max, y.min, y.max, z.min, z.max);
    }

    static fromRadius(radius = 5.0) {
        return new Range3(
            -radius, radius, 
            -radius, radius, 
            -radius, radius)
    }

    static fromRadii(xradius = 5, yradius = 4, zradius = 3) {
        return new Range3(-xradius, xradius, -yradius, yradius, -zradius, zradius)
    }

    //////////////

    static normalize(from: Range3, value: Point) {
        return Point.new(
            Domain.elevate(value.x, from.xmin, from.xmax),
            Domain.elevate(value.y, from.ymin, from.ymax),
            Domain.elevate(value.z, from.zmin, from.zmax)
        );
    }

    static elevate(from: Range3, value: Point) {
        return Point.new(
            Domain.elevate(value.x, from.xmin, from.xmax),
            Domain.elevate(value.y, from.ymin, from.ymax),
            Domain.elevate(value.z, from.zmin, from.zmax)
        );
    }

    static remap(value: Point, from: Range3, to: Range3) {
        return Point.new(
            Domain.remap(value.x, from.xmin, from.xmax, to.xmin, to.xmax),
            Domain.remap(value.y, from.ymin, from.ymax, to.ymin, to.ymax),
            Domain.remap(value.z, from.zmin, from.zmax, to.zmin, to.zmax)
        );
    }

    static spawn(range: Range3, rng: Random, count: number) : Point[] {
        let pts = Random.points(rng, count);
        pts = pts.map(p => Range3.elevate(range, p))
        return pts;
    }

    //////////////

    static readonly TypeShim = TypeShim.new("range-3", Type.Object, undefined, [
        TypeShim.new("xmin", Type.number),
        TypeShim.new("xmax", Type.number),
        TypeShim.new("ymin", Type.number),
        TypeShim.new("ymax", Type.number),
        TypeShim.new("zmin", Type.number),
        TypeShim.new("zmax", Type.number),
    ]);

    static _reference(nickname: string) {
        return TypeShim.new(nickname, Type.Reference, undefined, [Range3.TypeShim]);
    }


    static readonly Functions = MapTree.new<FunctionShim | Divider>([
        shim(Range3.new, "Range3", "A 3D numerical range", 
            [Type.number, Type.number, Type.number, Type.number, Type.number, Type.number], 
            [Type.Object]),
        shim(Range3.fromRanges, "Range3 from ranges", "Range3 from ranges",
            [Type.Object, Type.Object, Type.Object], 
            [Type.Object]),

        shim(Range3.fromRadius, "Range3 from radius", "",
            [Type.number], 
            [Type.Object]),
        shim(Range3.fromRadii, "Range3 from radii", "",
            [Type.number, Type.number, Type.number], 
            [Type.Object]),
        divider(),
        shim(Range3.normalize, "Normalize", "",
            [Type.Object, Type.number], 
            [Type.Object]),
        shim(Range3.elevate, "Elevate", ""
            [Type.Object, Type.number], 
            [Type.Object]),
        shim(Range3.spawn, "Spawn", "Spawn N number of Points within this Range", 
            [Type.Object, Type.Object, Type.number], 
            [Type.Object]),
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
