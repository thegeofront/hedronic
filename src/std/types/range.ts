import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";

export interface Range1 {
    trait: "range-1",
    start: number
    end: number
}

export interface Range2 {
    trait: "range-2",
    x: Range1,
    y: Range1,
}

export interface Range3 {
    trait: "range-3",
    x: Range1,
    y: Range1,
    z: Range1,
}

export const Range1Type = TypeShim.new("range-1", Type.Object, undefined, [
    TypeShim.new("start", Type.number),
    TypeShim.new("end", Type.number),
]);

export const Range2Type = TypeShim.new("range-2", Type.Object, undefined, [
    TypeShim.new("x", Type.Reference, undefined, [Range1Type]),
    TypeShim.new("y", Type.Reference, undefined, [Range1Type]),
]);

export const Range3Type = TypeShim.new("range-3", Type.Object, undefined, [
    TypeShim.new("x", Type.Reference, undefined, [Range1Type]),
    TypeShim.new("y", Type.Reference, undefined, [Range1Type]),
    TypeShim.new("z", Type.Reference, undefined, [Range1Type]),
]);