import { minify } from "terser-webpack-plugin/types/minify";
import { Domain } from "../../../../../../engine/src/lib";
import { FunctionShim } from "../../../../modules/shims/function-shim";
import { TypeShim } from "../../../../modules/shims/type-shim";
import { JsType } from "../../../../modules/types/type";
import { MapTree } from "../../../../util/maptree";
import { divider, Divider, func, make } from "../../../std-system";

export class Range1 {

    private constructor(
        public min: number,
        public max: number,
    ) {}

    
    static new(min: number = 0.0, max: number = 1.0) {
        return new Range1(min, max);
    }
    
    static fromRadius(radius: number = 5) {
        return new Range1(-radius, radius);
    }

    ///////////////////////////////////////////////////////////////////////////

    static normalize(value: number, range: Range1) {
        return Domain.normalize(value, range.min, range.max);
    }

    static elevate(value: number, range: Range1) {
        return Domain.elevate(value, range.min, range.max);
    }

    static remap(value: number, from: Range1 = Range1.new(), to: Range1 = Range1.new()) {
        return Domain.remap(value, from.min, from.max, to.min, to.max);
    }

    ///////////////////////////////////////////////////////////////////////////

    static readonly TypeShim = TypeShim.new("range-1", JsType.Object, undefined, [
        TypeShim.new("min", JsType.number),
        TypeShim.new("max", JsType.number),
    ]);

    static _reference(nickname: string) {
        return TypeShim.new(nickname, JsType.Reference, undefined, [Range1.TypeShim]);
    }

    static readonly Functions = [
        func("Range1", Range1.new),
        func("Range1 from radius", Range1.fromRadius),
        divider(),
        func("remap", Range1.remap),

        // I have not yet figured this stuff out...
        //     FunctionShim.new("remap", [namespace], remap, 
        //     [
        //         TypeShim.new("a", Type.number),
        //         newRange1Type("range-a"),   
        //         newRange1Type("range-b"), 
        //     ], [TypeShim.new("b", Type.number)]),
        //     FunctionShim.new("new range", [namespace], range, 
        //     [
        //         TypeShim.new("start", Type.number),
        //         TypeShim.new("end", Type.number),

        //     ], [newRange1Type("range-1")]),
        // ]; 
    ]; 
}