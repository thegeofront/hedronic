import { divider, shim } from "../std-system";
import { JsType } from "../../modules/types/type";

export function asNumber(n: any) : number {
    return Number(n);
}

export function asBoolean(n: any) : boolean {
    return Boolean(n);
}

export function asString(n: any): string {
    return String(n);
}

export function asList(any: any): any[] {
    return any as Array<any>;
}

export function asObject(any: any): Object {
    return Object(any);
}

export const Functions = [
    shim(asNumber, "Number", "Try to convert any to number", 
        [JsType.any], 
        [JsType.number]),
    shim(asNumber, "Bool", "Try to convert any to bool", 
        [JsType.any], 
        [JsType.boolean]),
    shim(asNumber, "string", "Try to convert any to string", 
        [JsType.any], 
        [JsType.string]),
    shim(asNumber, "List", "Try to convert any to list", 
        [JsType.any], 
        [JsType.List]),
    shim(asNumber, "Object", "Try to convert something to Object", 
        [JsType.any], 
        [JsType.Object]),
]; 