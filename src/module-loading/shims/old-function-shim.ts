
// Node ---- Operation ----
//             L Gizmo
//                L getState() -> store it in cable
//                L render() 
//                L onMouseAtCertainPosition() -> 
//                L  
// 

import { State } from "../../nodes-canvas/model/state";
import { FN, JSLoading } from "../helpers/js-loading";
import { TypeKind } from "./type-kind";
import { TypeShim } from "./type-shim";
  
/**
 * Offers a blueprint for creating a new node
 * It wraps a function, and delivers some useful information
 * This is needed, so we can reason about the functionalities of operations
 * Not the same as a Node : Multiple Different Nodes will point to the same FunctionBlueprint
 */
export class OldFunctionShim {

    public nameLower: string;

    private constructor(
        public readonly func: FN,
        public readonly name: string,
        public readonly inputTypes: TypeKind[],
        public readonly outputTypes: TypeKind[],
        public readonly numInputs: number, 
        public readonly numOutputs: number,
        public readonly namespace: string) {
            this.nameLower = name.toLowerCase();
        }

    static new() {
        
    }

    static newFromRawJs(func: FN, namespace: string) {
        let inCount = JSLoading.countInputsFromRawFunction(func);
        let outCount = JSLoading.countOutputsFromRawFunction(func);

        // with raw js, there is no way of ensuring type savety
        const inputTypes: TypeKind[] = [];
        for (let i = 0 ; i < inCount; i++) inputTypes.push(TypeKind.Any)
        const outputTypes: TypeKind[] = [];
        for (let i = 0 ; i < outCount; i++) outputTypes.push(TypeKind.Any)

        let name = func.name;
        return new OldFunctionShim(func, name, inputTypes, outputTypes, inCount, outCount, namespace);
    }

    run(args: State[]) {
        return this.func(...args);
    }

    log() {
        console.log(`this: ${this.func}`);
        console.log(`name: ${this.func.name}`);
        console.log(`inputs: ${this.numInputs}`);
        console.log(`outputs: ${this.numOutputs}`);    
    }

    toJson() {
        return {
            namespace: this.namespace,
            name: this.name,
        }
    }
}