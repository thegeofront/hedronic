import { Color as GeonColor } from "../../../../../engine/src/lib"
import { TypeShim } from "../../../modules/shims/type-shim"
import { Type } from "../../../modules/types/type"

// Q: why the heck do we need these different things? 

interface Color {
    trait: "color",
    data: number[],
}

const ColorType = TypeShim.new("color", Type.Object, undefined, [
    TypeShim.new("data", Type.List, undefined, [TypeShim.new("i", Type.number)])
]);

// 1: used in std functions to create the node right type guards 
// 2: used to nest this type in other types 
export function makeColorType(name: string) {
    return TypeShim.new(name, Type.Reference, undefined, [ColorType]);
}

// 1: can be called from rust or anywhere else to make use of native types
// 2: we use these declarations to make constructors for on the canvas
export function makeColor(data: number[]) : Color {
    return {trait: "color", data};
}

