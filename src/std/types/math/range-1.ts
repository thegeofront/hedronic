import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";

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
