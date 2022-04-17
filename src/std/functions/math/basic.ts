import { FunctionShim } from "../../../modules/shims/function-shim";
import { MapTree } from "../../maptree";
import { divider, Divider, make, STDTree } from "../../std-system";

export const BasicFunctions = MapTree.new<FunctionShim | Divider>([
    make(add),
    make(sub),
    make(mul),
    make(div),
    make(pow),
    divider(),
    make(sin),
    make(cos),
    make(tan),
    make(sqrt),
]);


function add(a: number, b: number) {
    return a + b;
}

function sub(a: number, b: number) {
    return a - b;
}

function mul(a: number, b: number) {
    return a * b;
} 

function div(a: number, b: number) {
    return a / b;
} 

function pow(a: number, b: number) {
    return Math.pow(a, b);
}

function sin(a: number) {
    return Math.sin(a);
} 

function cos(a: number) {
    return Math.cos(a);
} 

function tan(a: number) {
    return Math.tan(a);
} 

function sqrt(a: number) {
    return Math.sqrt(a);
}

// sqrt