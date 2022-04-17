import { FunctionShim } from "../modules/shims/function-shim";
import { TypeShim } from "../modules/shims/type-shim";
import { GFTypes } from "./geofront-types";
import { MapTree } from "./maptree";

export type Divider = "divider";

export type STDTree = MapTree<FunctionShim | Divider>;

export type ArrayTree<T> = Array<ArrayTree<T>> | T;

/**
 * Shorthander for quickly making a functionshim
 */
export function make(fn: Function) : [string, FunctionShim ] {
    return [fn.name, FunctionShim.newFromFunction(fn)];
}


/**
 * Shorthander for quickly making a functionshim
 */
 export function func(name: string, fn: Function) : [string, FunctionShim ] {
    return [name || fn.name, FunctionShim.newFromFunction(fn)];
}

/**
 * Shorthander for making a divider
 */
export function divider(k="div") : [string, Divider] {
    return [k, "divider"];
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

