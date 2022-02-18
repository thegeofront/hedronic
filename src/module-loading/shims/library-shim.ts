// purpose: module, or library representation

import { OldFunctionShim } from "./old-function-shim";
import { Catalogue, CoreType } from "../catalogue";
import { Widget } from "../../nodes-canvas/model/widget";
import { tryFilter } from "../../nodes-canvas/util/misc";
import { FN } from "../helpers/js-loading";


/**
 * A Module, in the programming language sense. 
 * Contains Blueprints for functions, variables, and widgets (variables with HTML attached)
 */
export class ModuleShim {
    constructor(
        public name: string,
        public icon: string,
        public fullPath: string,

        public blueprints: OldFunctionShim[],
        public widgets: Widget[],
        public catalogue: Catalogue,
        ) {}

    select(key: string, type: CoreType) {
        console.log(`select name: ${key} type: ${type}`);
        let core;
        if (type == CoreType.Operation) {
            core = tryFilter(this.blueprints, (item) => {return item.name == key});
        } else {
            core = tryFilter(this.widgets, (item) => {return item.name == key});
        }
        this.catalogue.selectCore(core);
    }

    static new(name: string, icon: string, fullPath: string, operations: OldFunctionShim[], widgets: Widget[], catalogue: Catalogue) {
        return new ModuleShim(name, icon, fullPath, operations, widgets, catalogue);
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
                let op = OldFunctionShim.newFromRawJs(f, name);
                ops.push(op);
            }
        }
        return new ModuleShim(name, icon, fullPath, ops, [], catalogue);
    }

    /**
     * publish this module globally
     */
    publishGlobally() {
        
        let space = {};

        for (let op of this.blueprints) {
            Object.defineProperty(space, op.name, { value: op.func, configurable: true});
        }
        Object.defineProperty(window, this.name, { value: space, configurable: true});
    }
}