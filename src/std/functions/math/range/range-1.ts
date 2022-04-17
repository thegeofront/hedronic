import { Domain } from "../../../../../../engine/src/lib";
import { FunctionShim } from "../../../../modules/shims/function-shim";
import { TypeShim } from "../../../../modules/shims/type-shim";
import { Type } from "../../../../modules/types/type";
import { MapTree } from "../../../maptree";
import { Divider, func, make } from "../../../std-system";

export interface Range1 {
    trait: "range-1",
    min: number
    max: number
}

const Range1Type = TypeShim.new("range-1", Type.Object, undefined, [
    TypeShim.new("min", Type.number),
    TypeShim.new("max", Type.number),
]);

export function newRange1Type(name: string) {
    return TypeShim.new(name, Type.Reference, undefined, [Range1Type]);
}

export function newRange1(min: number, max: number) : Range1 {
    return {trait: "range-1", min, max};
}

export const Range1Functions = MapTree.new<FunctionShim | Divider>([
    func("Range 1", (min: number, max: number) => {return new Domain(min, max)})
]);