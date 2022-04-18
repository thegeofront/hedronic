import { FunctionShim } from "../../../modules/shims/function-shim";
import { MapTree } from "../../../util/maptree";
import { Divider, make } from "../../std-system";

export const LogicFunctions = [
    make(and),
    make(or),
    make(not),
];

export function and(a: boolean, b: boolean) {
    return a && b;
}

export function or(a: boolean, b: boolean) {
    return a || b;
}

export function not(a: boolean) {
    return !a;
}