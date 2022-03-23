import { GeonNode } from "../nodes-canvas/model/node";
import { Vector2 } from "../../../engine/src/lib";
import { Widget } from "../nodes-canvas/model/widget";
import { FunctionShim } from "./shims/function-shim";
import { CoreType } from "../nodes-canvas/model/core";
import { ModuleShim } from "./shims/module-shim";
import { TypeShim } from "./shims/type-shim";
import { getDefaultWidgets } from "../internal-nodes/widgets/_registry";
import { getDefaultFunctions } from "../internal-nodes/operations/_registry";

/**
 * Catalogue containing shim Modules
 * Shims are wrappers of functions and variables. 
 * The canvas can use these to spawn nodes, and draw a graph
 * 
 * In the future, this would make creating a menu easier
 * TODO: Categories
 */
export class Catalogue {

    public selected?: FunctionShim | Widget;

    constructor(
        public modules: Map<string, ModuleShim>,
        public types: Map<string, TypeShim>) {}

    static new() : Catalogue {
        return new Catalogue(new Map(), new Map());
    }

    static newFromWidgets() {
        
        let cat = Catalogue.new();
        cat = createWithInternalFunctions(cat);
        return cat;
    }

    find(lib: string, key: string) {  
        let mod = this.modules.get(lib);
        if (!mod) {
            console.error(`no module is called: ${lib}`);
            return undefined;
        }      
        for (let type of [CoreType.Operation, CoreType.Widget]) {
            let res = this.trySelect(lib, key, type);
            if (res) {
                return res;
            }
        }
        return undefined;
    }

    trySelect(lib: string, key: string, type: CoreType) {
        let mod = this.modules.get(lib);
        if (!mod) {
            console.error(`no module is called: ${lib}`);
            return undefined;
        }
        mod.select(key, type, this);
        return this.selected;
    }

    selectCore(core: FunctionShim | Widget | undefined) {
        this.selected = core;
    }

    select(lib: string, key: string, type: CoreType) {
        this.modules.get(lib)!.select(key, type, this);
    }

    deselect() {
        this.selected = undefined;
    }

    /**
     * Spawn an instance of the selected node at a location 
     */
    spawn(gp: Vector2) {
        if (this.selected) {
            return GeonNode.new(gp, this.selected);
        } else {
            return undefined;
        }
    }

    addLibrary(lib: ModuleShim) {
        this.modules.set(lib.name, lib);
        lib.publishGlobally();
    } 

    /**
     * Print yourself
     */
    print() {
        for (let [name, mod] of this.modules) {
            console.log(name);
            for (let func of mod.blueprints) {
                console.log(" L ",func.nameLower);
            }
        }
    }
}

function createWithInternalFunctions(cat: Catalogue) {
    // create widgets
    let widgets = getDefaultWidgets();
    let widMod = ModuleShim.new("widgets", "bi-lightning-charge-fill", "",{}, [], widgets);
    cat.addLibrary(widMod);

    // repeat for functions 
    let functions = getDefaultFunctions();
    let fnMod = ModuleShim.new("functions", "bi-lightning-charge-fill", "",{}, functions, []);
    cat.addLibrary(fnMod);
    
    return cat;
}

/**
 * To make sure nested operations work, we need to publish the catalogue globally. 
 */
 export function makeOperationsGlobal(catalogue: Catalogue, namespace="GEON") {
    
    let space = {};
    Object.defineProperty(window, namespace, { value: space, configurable: true});

    // for (let op of catalogue.allOperations()) {
    //     Object.defineProperty(space, op.func.name, { value: op.func, configurable: true});
    // }
}