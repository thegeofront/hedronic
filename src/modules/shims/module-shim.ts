// purpose: module, or library representation
import { Catalogue } from "../catalogue";
import { Widget } from "../../nodes-canvas/model/widget";
import { tryFilter } from "../../nodes-canvas/util/misc";
import { FN } from "../helpers/js-loading";
import { FunctionShim } from "./function-shim";
import { Core, CoreType } from "../../nodes-canvas/model/core";
import { Debug } from "../../../../engine/src/lib";
import { ModuleMetaData } from "./module-meta-data";

/**
 * A Module, in the programming language sense. 
 * Contains Blueprints for functions, variables, and widgets (variables with HTML attached)
 */
export class ModuleShim {
    private constructor(
        public meta: ModuleMetaData,
        public realModule: any,
        public blueprints: FunctionShim[],
        public widgets: Widget[]
        ) {}

    get name() {
        return this.meta?.nickname;
    }

    get fullPath() {
        return this.meta?.jsPath;
    }

    static new(meta: ModuleMetaData, realModule: any, operations: FunctionShim[], widgets: Widget[]) {
        return new ModuleShim(meta, realModule, operations, widgets);
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
                let op = FunctionShim.newFromFunction(f, [fullPath, f.name]); 
                ops.push(op);
            }
        }

        // NOTE: fullpath is strange in this context...
        // I think it is misused here... no time to figure out
        let meta = ModuleMetaData.newCustom(name, name, icon);
        meta.jsPath = fullPath;
        return new ModuleShim(meta, obj, ops, []);
    }

    /**
     * NOTE: path is not used, it just takes the last item of the path, and expects that this is a unique function name. This will not always work
     */
    select(path: string[]) {
        // console.log(`select name: ${key} type: ${type}`);
        let core;
        let functionname = path[path.length - 1];
        core = tryFilter(this.blueprints, (item) => {return item.name == functionname});
        if (core == undefined) {
            // then try to find the widget
            core = tryFilter(this.widgets, (item) => {return item.name == functionname});
        }
        return core;
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