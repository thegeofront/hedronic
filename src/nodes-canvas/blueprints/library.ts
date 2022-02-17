// purpose: module, or library representation

import { FN, Blueprint } from "./blueprint";
import { Widget } from "../model/widget";
import { tryFilter } from "../util/misc";
import { Catalogue, CoreType } from "./catalogue";


/**
 * A library, in the programming language sense. 
 * Contains Blueprints for functions, variables, and widgets (variables with HTML attached)
 */
export class Library {
    constructor(
        public name: string,
        public icon: string,
        public fullPath: string,

        public blueprints: Blueprint[],
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

    static new(name: string, icon: string, fullPath: string, operations: Blueprint[], widgets: Widget[], catalogue: Catalogue) {
        return new Library(name, icon, fullPath, operations, widgets, catalogue);
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
                let op = Blueprint.new(f, name);
                ops.push(op);
            }
        }
        return new Library(name, icon, fullPath, ops, [], catalogue);
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