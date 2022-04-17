import { COLOR, Color, rgbToHsl } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";

let colorType = TypeShim.new("", Type.any);

export function getColorFunctions(namespace="functions") {

    return [
        new FunctionShim("colorFromString", [namespace], fromString, [TypeShim.new("str", Type.string)] , [colorType]),
        new FunctionShim("HSL", [namespace], hsl, [
                TypeShim.new("h", Type.number), 
                TypeShim.new("s", Type.number), 
                TypeShim.new("l", Type.number), 
                TypeShim.new("a", Type.number)
            ], [colorType]),
        new FunctionShim("RGB", [namespace], rgb, [
                TypeShim.new("r", Type.number), 
                TypeShim.new("g", Type.number), 
                TypeShim.new("b", Type.number), 
                TypeShim.new("a", Type.number)
            ], 
            [colorType])
    ]; 
}

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