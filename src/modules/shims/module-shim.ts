// purpose: module, or library representation
import { Catalogue } from "../catalogue";
import { Widget } from "../../nodes-canvas/model/widget";
import { tryFilter } from "../../nodes-canvas/util/misc";
import { FN } from "../helpers/js-loading";
import { FunctionShim } from "./function-shim";
import { Core, CoreType } from "../../nodes-canvas/model/core";


/**
 * A Module, in the programming language sense. 
 * Contains Blueprints for functions, variables, and widgets (variables with HTML attached)
 */
export class ModuleShim {
    constructor(
        public name: string,
        public icon: string,
        public fullPath: string,

        public readModule: any,

        public blueprints: FunctionShim[],
        public widgets: Widget[]
        ) {}

    select(key: string, type: CoreType, catalogue: Catalogue) {
        // console.log(`select name: ${key} type: ${type}`);
        let core;
        if (type == CoreType.Operation) {
            core = tryFilter(this.blueprints, (item) => {return item.name == key});
        } else {
            core = tryFilter(this.widgets, (item) => {return item.name == key});
        }
        catalogue.selectCore(core);
    }

    static new(name: string, icon: string, fullPath: string, realModule: any, operations: FunctionShim[], widgets: Widget[]) {
        return new ModuleShim(name, icon, fullPath, realModule, operations, widgets);
    }

    /**
     * extract the object. If it contains defined functions, fill it
     */
    static fromJsObject(name: string, icon: string, fullPath: string, origin: string, obj: any) {
        let ops = [];
        for (const key in obj) {
            let value = obj[key];
            if (value instanceof Function) {
                let f = value as FN;
                let op = FunctionShim.newFromFunction(f, f.name);
                ops.push(op);
            }
        }
        return new ModuleShim(name, icon, fullPath, obj, ops, []);
    }

    /**
     * publish this module globally
     */
    publishGlobally() {
        
        let space = {};

        for (let op of this.blueprints) {
            Object.defineProperty(space, op.name, { value: "hallo", configurable: true});
        }
        Object.defineProperty(window, this.name, { value: space, configurable: true});
    }
}