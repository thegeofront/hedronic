import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { newRange1Type, Range1 } from "./range-1";

export interface Range3 {
    trait: "range-3",
    x: Range1,
    y: Range1,
    z: Range1,
}

export const Range3Type = TypeShim.new("range-3", Type.Object, undefined, [
    newRange1Type("x"),
    newRange1Type("y"),
    newRange1Type("z"),
]);

export function newRange2Type(name: string) {
    return TypeShim.new(name, Type.Reference, undefined, [Range3Type]);
}

export function newRange2(x: Range1, y: Range1, z: Range1) : Range3 {
    return {trait: "range-3", x, y, z};
}
