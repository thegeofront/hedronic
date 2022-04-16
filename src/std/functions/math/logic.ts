import { FunctionShim } from "../../../modules/shims/function-shim";
import { Divider, make, MapTree } from "../../std-system";
import { add } from "../vector-0/xyz";

export const LogicFunctions = MapTree.new<FunctionShim | Divider>([
    make(add),
    make(or),
    make(not),
]);

export function and(a: boolean, b: boolean) {
    return a && b;
}

export function or(a: boolean, b: boolean) {
    return a || b;
}

export function not(a: boolean) {
    return !a;
}