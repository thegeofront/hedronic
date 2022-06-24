import { Domain } from "../../../../../../engine/src/lib";
import { FunctionShim } from "../../../../modules/shims/function-shim";
import { TypeShim } from "../../../../modules/shims/type-shim";
import { JsType } from "../../../../modules/types/type";
import { MapTree } from "../../../../util/maptree";
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

    static readonly TypeShim = TypeShim.new("range-3", JsType.Object, undefined, [
        TypeShim.new("xmin", JsType.number),
        TypeShim.new("xmax", JsType.number),
        TypeShim.new("ymin", JsType.number),
        TypeShim.new("ymax", JsType.number),
        TypeShim.new("zmin", JsType.number),
        TypeShim.new("zmax", JsType.number),
    ]);

    static _reference(nickname: string) {
        return TypeShim.new(nickname, JsType.Reference, undefined, [Range3.TypeShim]);
    }


    static readonly Functions = [
        shim(Range3.new, "Range3", "A 3D numerical range", 
            [JsType.number, JsType.number, JsType.number, JsType.number, JsType.number, JsType.number], 
            [JsType.Object]),
        shim(Range3.fromRanges, "Range3 from ranges", "Range3 from ranges",
            [JsType.Object, JsType.Object, JsType.Object], 
            [JsType.Object]),

        shim(Range3.fromRadius, "Range3 from radius", "",
            [JsType.number], 
            [JsType.Object]),
        shim(Range3.fromRadii, "Range3 from radii", "",
            [JsType.number, JsType.number, JsType.number], 
            [JsType.Object]),
        divider(),
        shim(Range3.normalize, "Normalize", "",
            [JsType.Object, JsType.number], 
            [JsType.Object]),
        shim(Range3.elevate, "Elevate", ""
            [JsType.Object, JsType.number], 
            [JsType.Object]),
        shim(Range3.spawn, "Spawn", "Spawn N number of Points within this Range", 
            [JsType.Object, JsType.Object, JsType.number], 
            [JsType.Object]),
    ]; 
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
