import { minify } from "terser-webpack-plugin/types/minify";
import { Domain } from "../../../../../../engine/src/lib";
import { FunctionShim } from "../../../../modules/shims/function-shim";
import { TypeShim } from "../../../../modules/shims/type-shim";
import { Type } from "../../../../modules/types/type";
import { MapTree } from "../../../maptree";
import { divider, Divider, func, make } from "../../../std-system";

export class Range1 {

    private constructor(
        public min: number,
        public max: number,
    ) {}

    
    static new(min: number, max: number) {
        return new Range1(min, max);
    }
    
    static fromRadius(radius: number) {
        return new Range1(-radius, radius);
    }

    static remap(n: number, a: Range1, b: Range1) {
        return Domain.remap(n, a.min, a.max, b.min, b.max);
    }

    ///////////////////////////////////////////////////////////////////////////

    static readonly TypeShim = TypeShim.new("range-1", Type.Object, undefined, [
        TypeShim.new("min", Type.number),
        TypeShim.new("max", Type.number),
    ]);

    static _reference(nickname: string) {
        return TypeShim.new(nickname, Type.Reference, undefined, [Range1.TypeShim]);
    }

    static readonly Functions = MapTree.new<FunctionShim | Divider>([
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
    ]); 
}