import { FunctionShim } from "../modules/shims/function-shim";
import { TypeShim } from "../modules/shims/type-shim";
import { JsType } from "../modules/types/type";
import { MapTree } from "../util/maptree";
import { GFTypes } from "./geofront-types";

export type Divider = "divider";

export type STDTree = MapTree<FunctionShim | Divider>;

export type ArrayTree<T> = Array<ArrayTree<T>> | T;



/**
 * Shorthander for quickly making a functionshim
 */
export function make(fn: Function) : FunctionShim {
    return FunctionShim.newFromFunction(fn);
}


/**
 * Shorthander for quickly making a functionshim
 */
export function func(name: string, fn: Function) {
    return FunctionShim.newFromFunction(fn, [name]);
}



export function shim(
    fn: Function, 
    name: string, 
    description: string, 
    ins: JsType[] = [], 
    outs: JsType[] = []) : FunctionShim 
    {
    let inTypes = ins.map((i) => TypeShim.new(JsType[i], i, undefined, []))
    let outTypes = outs.map((o) => TypeShim.new(JsType[o], o, undefined, []))
    
    return FunctionShim.new(name, [], fn, inTypes, outTypes);
}

/**
 * Shorthander for making a divider
 */
export function divider() : Divider {
    return "divider";
} 


/**
 * if this typeshim deserves traits, give them
 */
export function tryApplyGeofrontType(type: TypeShim, availableTypes: Map<GFTypes, TypeShim>) {

    for (let [trait, shim] of availableTypes.entries()) {
        if (type.isAcceptableType(shim)) {
            // console.log(type, "is acceptable to ", Trait[trait]);
            type.traits.push(trait);
        } 
        // else if (shim.isAcceptableType(type)) {
        //     console.log(type, "is reverse acceptable to ", Trait[trait]);
        //     type.traits.push(trait);
        // }
    }

    return type;
}

