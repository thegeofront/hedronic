
// Node ---- Operation ----
//             L Gizmo
//                L getState() -> store it in cable
//                L render() 
//                L onMouseAtCertainPosition() -> 
//                L  
// 

import { State } from "../nodes-canvas/model/state";

export type FN = (...args: State[]) => State[];

/**
 * Offers a blueprint for creating a new node
 * It wraps a function, and delivers some useful information
 * This is needed, so we can reason about the functionalities of operations
 * Not the same as a Node : Multiple Different Nodes will point to the same FunctionBlueprint
 */
export class FunctionBlueprint {

    public nameLower: string;

    private constructor(
        public readonly func: FN,
        public readonly name: string,
        public readonly numInputs: number, 
        public readonly numOutputs: number,
        public readonly namespace: string) {
            this.nameLower = name.toLowerCase();
        }

    static new(func: FN, namespace: string) {
        let inCount = FunctionBlueprint.countInputs(func);
        let outCount = FunctionBlueprint.countOutputs(func);
        let name = func.name;
        return new FunctionBlueprint(func, name, inCount, outCount, namespace);
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

    // ---- util

    static countInputs(operation: FN) {
        return operation.length;
    }

    static countOutputs(operation: FN) {
        // HACK: its hard to determine the number of inputs, so im directly reading the string of the operation, 
        // and derriving it from the number of comma's found in the return statement.
        // this could create some nasty unforseen side effects...
        let getOutput = /return.*(\[.*\]).*/
        let match = getOutput.exec(operation.toString()) || "";
        let output = match[1];
        if (!output) {
            return 1;
        }
        if (output == "[]") {
            return 0;
        }

        let count = output.split(',').length;
        
        return count;
    }
}