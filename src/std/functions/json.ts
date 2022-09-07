import { divider, shim } from "../std-system";
import { JsType } from "../../modules/types/type";

export function decode(text: string): Object {
    return JSON.parse(text)
}

export function encode(json: any, indent?: number): string {
    return JSON.stringify(json, undefined, indent);
}

export const JsonFunctions = [
    shim(decode, "decode", "Parse a string to a json (or any json-like value)", 
        [JsType.string], 
        [JsType.Object]),
    shim(encode, "encode", "Encode a json-like object to a string", 
        [JsType.any, JsType.number], 
        [JsType.string]),
]; 