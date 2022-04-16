
import { TypeShim } from "../../../../modules/shims/type-shim";
import { Type } from "../../../../modules/types/type";
import { newRange1Type, Range1 } from "./range-1";

export interface Range2 {
    trait: "range-2",
    x: Range1,
    y: Range1,
}

const Range2Type = TypeShim.new("range-2", Type.Object, undefined, [
    newRange1Type("x"),
    newRange1Type("y"),
]);

export function newRange2Type(name: string) {
    return TypeShim.new(name, Type.Reference, undefined, [Range2Type]);
}

export function newRange2(x: Range1, y: Range1) : Range2 {
    return {trait: "range-2", x, y};
}
