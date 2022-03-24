import { FunctionShim } from "../../modules/shims/function-shim";
import { getSequencingFunctions } from "./sequencing";
import { getTriangulateFunctions } from "./triangulation";


export function getDefaultFunctions() : FunctionShim[] {
    return [
        ...getSequencingFunctions(),
        ...getTriangulateFunctions()
    ]
}