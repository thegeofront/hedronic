
// Node ---- Operation ----
//             L Gizmo
//                L getState() -> store it in cable
//                L render() 
//                L onMouseAtCertainPosition() -> 
//                L  
// 

import { State } from "../../nodes-canvas/model/state";
import { FN, JSLoading } from "../helpers/js-loading";
import { Type, TypeShim } from "./parameter-shim";

/**
 * Offers a blueprint for creating a new node
 * wrap a function, and delivers some useful information
 * This is needed, so we can reason about the functionalities of operations
 * Not the same as a Node, Because multiple nodes will point to the same FunctionShim
 * 
 */
export class FunctionShim {

    public nameLower: string;

    constructor(
        public readonly name: string,
        public readonly path: string[],
        public readonly func: Function,
        public readonly ins: TypeShim[],
        public readonly outs: TypeShim[],
        public readonly isMethod = false,
        ) {
        this.nameLower = name.toLowerCase();
        
        // if (this.isMethod) {
        //     this.run = (...inputs: any) => this.func.call(inputs[0], ...inputs.slice(1));
        // } else {
        //     this.run = (...inputs: any) => this.func(...inputs);
        // }
    }

    get inCount() {
        return this.ins.length;
    }

    get outCount() {
        return this.outs.length;
    }

    static newFromFunction(func: Function, name="function", namespace="custom") {

        let inCount = JSLoading.countInputsFromRawFunction(func);
        let outCount = JSLoading.countOutputsFromRawFunction(func);

        // with raw js, there is no way of ensuring type savety
        let ins: TypeShim[] = [];
        for (let i = 0 ; i < inCount; i++) ins.push(TypeShim.new(`in${i}`, Type.any))
        let outs: TypeShim[] = [];
        for (let i = 0 ; i < outCount; i++) outs.push(TypeShim.new(`out${i}`, Type.any))

        return new FunctionShim(name, [namespace, name], func, ins, outs);
    }

    async run(inputs: any[]) {
        if (this.isMethod) {
            return await this.func.call(inputs[0], ...inputs.slice(1));
        }
        return await this.func(...inputs);
    }

    log() {
        console.log(`name: ${this.name}`);
        console.log(`path: ${this.path}`);
        console.log(`inputs: ${this.inCount}`);
        console.log(`outputs: ${this.outCount}`);    
    }

    toJson() {
        return {
            name: this.name,
            path: this.path,
            inCount: this.inCount,
            outCount: this.outCount,
            ins: this.ins.map((input) => input.typeToString()),
            outs: this.outs.map((output) => output.typeToString()),
        }
    }
}