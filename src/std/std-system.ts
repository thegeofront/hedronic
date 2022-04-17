import { FunctionShim } from "../modules/shims/function-shim";
import { MapTree } from "./maptree";

export type Divider = "divider";

export type STDTree = MapTree<FunctionShim | Divider>;

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
export function divider() : [string, Divider] {
    return ["divider", "divider"];
} 