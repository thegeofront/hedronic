import { COLOR, Color, rgbToHsl } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";

let colorType = TypeShim.new("", JsType.any);

export const ColorFunctions = [
    new FunctionShim(
        "colorFromString", 
        [], 
        fromString, 
        [TypeShim.new("str", JsType.string)] , 
        [colorType]),
    new FunctionShim("HSL", [], hsl, [
            TypeShim.new("h", JsType.number), 
            TypeShim.new("s", JsType.number), 
            TypeShim.new("l", JsType.number), 
            TypeShim.new("a", JsType.number)
        ], [colorType]),
    new FunctionShim("RGB", [], rgb, [
            TypeShim.new("r", JsType.number), 
            TypeShim.new("g", JsType.number), 
            TypeShim.new("b", JsType.number), 
            TypeShim.new("a", JsType.number)
        ], 
        [colorType])
]; 


function fromString(str: string) {
    if (str in COLOR) {
        //@ts-ignore
        return COLOR[str];
    } else {
        return Color.fromHex(str);   
    }
}

function hsl(h: number, s: number, l: number, a: number) {
    return Color.fromHSL(h,s,l,a);
}

function rgb(r: number, g: number, b: number, a: number) {
    return Color.fromHSL(r,g,b,a);
}


// interface Color {
//     trait: "color",
//     data: number[],
// }

// const ColorType = TypeShim.new("color", Type.Object, undefined, [
//     TypeShim.new("data", Type.List, undefined, [TypeShim.new("i", Type.number)])
// ]);

// // 1: used in std functions to create the node right type guards 
// // 2: used to nest this type in other types 
// export function makeColorType(name: string) {
//     return TypeShim.new(name, Type.Reference, undefined, [ColorType]);
// }

// // 1: can be called from rust or anywhere else to make use of native types
// // 2: we use these declarations to make constructors for on the canvas
// export function makeColor(data: number[]) : Color {
//     return {trait: "color", data};
// }

