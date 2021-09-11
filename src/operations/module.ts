// purpose: module, or library representation

import { FN, Operation } from "../graph/operation";
import { Widget } from "../graph/widget";
import { tryFilter } from "../util/misc";
import { Catalogue, CoreType } from "./catalogue";



export class NodesModule {
    constructor(
        public name: string,
        public icon: string,
        public fullPath: string,
        public operations: Operation[],
        public widgets: Widget[],
        public catalogue: Catalogue,
        ) {}

    select(key: string, type: CoreType) {
        console.log(`select name: ${key} type: ${type}`);
        let core;
        if (type == CoreType.Operation) {
            core = tryFilter(this.operations, (item) => {return item.name == key});
        } else {
            core = tryFilter(this.widgets, (item) => {return item.name == key});
        }
        this.catalogue.selectCore(core);
    }

    static new(name: string, icon: string, fullPath: string, operations: Operation[], widgets: Widget[], catalogue: Catalogue) {
        return new NodesModule(name, icon, fullPath, operations, widgets, catalogue);
    }

    /**
     * extract the object. If it contains defined functions, fill it
     */
    static fromJsObject(name: string, icon: string, fullPath: string, origin: string, obj: any, catalogue: Catalogue) {
        let ops = [];
        for (const key in obj) {
            let value = obj[key];
            if (value instanceof Function) {
                let f = value as FN;
                let op = Operation.new(f, name);
                ops.push(op);
            }
        }
        return new NodesModule(name, icon, fullPath, ops, [], catalogue);
    }

    /**
     * publish this module globally
     */
    publishGlobally() {
        
        let space = {};

        for (let op of this.operations) {
            Object.defineProperty(space, op.name, { value: op.func, configurable: true});
        }
        Object.defineProperty(window, this.name, { value: space, configurable: true});
    }
}