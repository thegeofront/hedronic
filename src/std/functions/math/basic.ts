import { FunctionShim } from "../../../modules/shims/function-shim";
import { Divider, MapTree, STDTree } from "../../std-system";

export function basic(namespace: string[]) : STDTree {

    let make = (fn: Function) : [string, FunctionShim ]=> {
        let name = fn.name;
        return [fn.name, FunctionShim.newFromFunction(fn, [...namespace, name])];
    }

    let divider = () : [string, Divider] => ["divider", "divider"];

    return MapTree.new<FunctionShim | Divider>([
        make(add),
        make(sub),
        make(mul),
        make(div),
        make(pow),
        divider(),
        make(sin),
        make(cos),
        make(tan),
    ])
    
    // return [
    //     FunctionShim.newFromFunction(add, [...namespace, "add"]),
    //     FunctionShim.newFromFunction(sub, [...namespace, "sub"]),
    //     FunctionShim.newFromFunction(mul, [...namespace, "mul"]),
    //     FunctionShim.newFromFunction(div, [...namespace, "div"]),
    //     FunctionShim.newFromFunction(pow, [...namespace, "pow"]),
    //     "divider",
    //     FunctionShim.newFromFunction(sin, [...namespace, "sin"]),
    //     FunctionShim.newFromFunction(cos, [...namespace, "cos"]),
    //     FunctionShim.newFromFunction(tan, [...namespace, "tan"]),
    // ];
}


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
// sin cos tan

// sqrt