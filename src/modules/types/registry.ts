/**
 * A collection of types used internally by the geofront environment
 * 
 * Q: This seems weird, why is it needed?
 * A: Certain javascript objects will get additional geofront support (like visualization). 
 *    We must recognise and label these special objects during import.    
 */

import { TypeShim } from "../shims/type-shim";
import { getBufferTypes, JsType } from "./type";

export function getStandardTypesAsDict(suffix="") : Map<string, TypeShim> {
    let types = new Map<string, TypeShim>();

    for (let type of getBufferTypes()) {
        types.set(type.name, type);
    }

    return types;
}





