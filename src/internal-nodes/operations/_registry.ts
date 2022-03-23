import { FunctionShim } from "../../modules/shims/function-shim";
import { getTriangulateFunctions } from "./triangulate";


export function getDefaultFunctions() : FunctionShim[] {
    return [
        ...getTriangulateFunctions()
    ]
}