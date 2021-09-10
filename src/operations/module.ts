// purpose: module, or library representation

import { FN, Operation } from "../graph/operation";
import { Widget } from "../graph/widget";
import { Catalogue, CoreType } from "./catalogue";


export class NodesModule {
    constructor(
        public name: string,
        public operations: Map<string, Operation>,
        public widgets: Map<string, Widget>,
        public catalogue: Catalogue,
        ) {}

    getAll() {
        let ops = new Array<Operation>();
        
        let keys = this.operations.keys();
        for (let i = 0 ; i < this.operations.size; i++) {
            ops[i] = this.operations.get(keys.next().value)!;
        }
        return ops;
    }

    getAllWidgets() {
        let wids = new Array<Widget>();
        
        let keys = this.widgets.keys();
        for (let i = 0 ; i < this.widgets.size; i++) {
            wids[i] = this.widgets.get(keys.next().value)!;
        }
        return wids;
    }

    select(key: string, type: CoreType) {
        console.log(`select name: ${key} type: ${type}`);
        let core;
        if (type == CoreType.Operation) {
            core = this.operations.get(key)
        } else {
            core = this.widgets.get(key);
        }
        this.catalogue.selectCore(core);
    }

    static new(name: string, operations: Map<string, Operation>, widgets: Map<string, Widget>, catalogue: Catalogue) {
        return new NodesModule(name, operations, widgets, catalogue);
    }

    static fromLists(name: string, operations: Operation[], widgets: Widget[], catalogue: Catalogue) {

        let opMap = new Map();
        for(let op of operations) {
            opMap.set(op.name, op);
        }

        let widMap = new Map();
        for(let wid of widgets) {
            widMap.set(wid.name, wid);
        }
        return new NodesModule(name, opMap, widMap, catalogue);
    }

    /**
     * extract the object. If it contains defined functions, fill it
     */
    static fromJsObject(name: string, origin: string, obj: any, catalogue: Catalogue) {
        let ops = new Map<string, Operation>();
        for (const key in obj) {
            let value = obj[key];
            if (value instanceof Function) {
                let f = value as FN;
                let op = Operation.new(f, name);
                ops.set(op.name, op);
            }
        }
        return new NodesModule(name, ops, new Map(), catalogue);
    }

    /**
     * publish this module globally
     */
    publishGlobally() {
        
        let space = {};

        for (let op of this.operations.values()) {
            Object.defineProperty(space, op.name, { value: op.func, configurable: true});
        }
        Object.defineProperty(window, this.name, { value: space, configurable: true});
    }
}