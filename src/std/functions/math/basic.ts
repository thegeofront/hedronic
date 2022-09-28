import { FunctionShim } from "../../../modules/shims/function-shim";
import { MapTree } from "../../../util/maptree";
import { divider, Divider, make, STDTree } from "../../std-system";

export const BasicFunctions = [
    make(add),
    make(sub),
    make(mul),
    make(div),
    make(pow),
    divider(),
    make(sin),
    divider(),
    make(cos),
    make(tan),
    make(sqrt),
    make(distance),
    make(Point),
];


function add(a: number, b: number) {
    return a + b;
}

function distance(a: number, b: number) {
    return 5;
}

function Point(in1: number, in2: number) {
    return 5;
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