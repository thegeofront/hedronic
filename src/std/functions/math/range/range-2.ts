import { FunctionShim } from "../../../../modules/shims/function-shim";
import { TypeShim } from "../../../../modules/shims/type-shim";
import { JsType } from "../../../../modules/types/type";
import { MapTree } from "../../../../util/maptree";
import { Divider, func, divider } from "../../../std-system";
import { Range1 } from "./range-1";

export class Range2 {
    
    private constructor(
        public xmin: number,
        public xmax: number,
        public ymin: number,
        public ymax: number,
    ) {}

    static new(xmin: number, xmax: number, ymin: number, ymax: number) {
        return new Range2(xmin, xmax, ymin, ymax);
    }

    static fromRanges(x: Range1, y: Range1) {
        return new Range2(x.min, x.max, y.min, y.max);
    }

    static fromRadius(radius: number) {
        return new Range2(-radius, radius, -radius, radius)
    }

    static fromRadii(xradius: number, yradius: number) {
        return new Range2(-xradius, xradius, -yradius, yradius)
    }

    //////////////

    // static normalize(value: number, range: Range2) {
    //     return Range1.normalize(value, );
    // }

    // static elevate(value: number, range: Range2) {
    //     return Domain.elevate(value, range.min, range.max);
    // }

    // static remap(value: number, from: Range1 = Range1.new(), to: Range1 = Range1.new()) {
    //     return Domain.remap(value, from.min, from.max, to.min, to.max);
    // }

    //////////////

    static readonly TypeShim = TypeShim.new("range-2", JsType.Object, undefined, [
        TypeShim.new("xMin", JsType.number),
        TypeShim.new("xMax", JsType.number),
        TypeShim.new("yMin", JsType.number),
        TypeShim.new("yMax", JsType.number),
    ]);

    static _reference(nickname: string) {
        return TypeShim.new(nickname, JsType.Reference, undefined, [Range2.TypeShim]);
    }


    static readonly Functions = [
        func("Range2", Range2.new),
        func("Range2 from ranges", Range2.fromRanges),
        func("Range2 from radius", Range2.fromRadius),
        func("Range2 from radii", Range2.fromRadii),
        divider(),
    ]; 
}

// export function newRange2Type(name: string) {
//     return TypeShim.new(name, Type.Reference, undefined, [Range2Type]);
// }

// export function newRange2(x: Range1, y: Range1) : Range2 {
//     return {trait: "range-2", x, y};
// }
