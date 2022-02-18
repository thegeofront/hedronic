
// Node ---- Operation ----
//             L Gizmo
//                L getState() -> store it in cable
//                L render() 
//                L onMouseAtCertainPosition() -> 
//                L  
// 

import { State } from "../../nodes-canvas/model/state";
import { FN, JSLoading } from "../helpers/js-loading";
import { TypeShim } from "./type-shim";
  
/**
 * Offers a blueprint for creating a new node
 * It wraps a function, and delivers some useful information
 * This is needed, so we can reason about the functionalities of operations
 * Not the same as a Node : Multiple Different Nodes will point to the same FunctionBlueprint
 */
export class FunctionShim {

    public nameLower: string;

    constructor(
        public readonly name: string,
        public readonly invokeCode: string[], 
        public readonly moduleName: string,
        
        public readonly inTypes: TypeShim[],
        public readonly outTypes: TypeShim[]
        ) {
            this.nameLower = name.toLowerCase();
        }

    get inCount() {
        return this.inTypes.length;
    }

    get outCount() {
        return this.inTypes.length;
    }

    log() {
        console.log(`name: ${this.name}`);
        console.log(`invokeCode: ${this.invokeCode}`);
        console.log(`inputs: ${this.inCount}`);
        console.log(`outputs: ${this.outCount}`);    
    }

    toJson() {
        return {
            namespace: this.moduleName,
            name: this.name,
        }
    }
}