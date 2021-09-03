// purpose: module, or library representation

import { FN, Operation } from "../graph/operation";


export class NodesModule {
    constructor(
        public name: string,
        public operations: Map<string, Operation>,
        ) {}

    static new(name: string, operations: Map<string, Operation>) {
        return new NodesModule(name, operations);
    }

    /**
     * extract the object. If it contains defined functions, fill it
     */
    static fromJsObject(name: string, origin: string, obj: any) {
        let ops = new Map<string, Operation>();
        for (const key in obj) {
            let value = obj[key];
            if (value instanceof Function) {
                let f = value as FN;
                let op = Operation.new(f);
                ops.set(op.name, op);
            }
        }
        return new NodesModule(name, ops);
    }

    /**
     * publish this module globally
     */
    publishGlobally() {
        
        let space = {};
        Object.defineProperty(window, this.name, { value: space, configurable: true});

        for (let op of this.operations.values()) {
            Object.defineProperty(space, op.func.name, { value: op.func, configurable: true});
        }
    }
}