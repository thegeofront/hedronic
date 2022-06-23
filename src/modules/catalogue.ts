import { GeonNode } from "../nodes-canvas/model/node";
import { Vector2 } from "../../../engine/src/lib";
import { Widget } from "../nodes-canvas/model/widget";
import { FunctionShim } from "./shims/function-shim";
import { CoreType } from "../nodes-canvas/model/core";
import { ModuleShim } from "./shims/module-shim";
import { TypeShim } from "./shims/type-shim";
import { getDefaultWidgets, STD } from "../std/std";

/**
 * Catalogue containing shim Modules
 * Shims are wrappers of functions and variables. 
 * The canvas can use these to spawn nodes, and draw a graph
 * 
 * In the future, this would make creating a menu easier
 */
export class Catalogue {

    public selected?: FunctionShim | Widget;
    public std!: STD;

    constructor(
        public modules: Map<string, ModuleShim>, // all modules (collections of functions)
        public types: Map<string, TypeShim> // all type definitions [JF]: I dont know why we need this...
        ) {}

    static new() : Catalogue {
        return new Catalogue(new Map(), new Map());
    }

    static newFromWidgets() {
        
        let cat = Catalogue.new();

        // create the std
        cat.std = STD.default();

        // create widgets
        let widgets = getDefaultWidgets();
        let widMod = ModuleShim.new("widgets", "bi-lightning-charge-fill", "",{}, [], widgets);
        cat.addLibrary(widMod);

        // repeat for functions 
        return cat;
    }

    toJson() {
        return {};
    }

    get(lib: string, path: string[]) {  
        if (lib == "std") {
            return this.std.get(path);
        }

        let mod = this.modules.get(lib);
        if (!mod) {
            console.error(`no module is called: ${lib}`);
            return undefined;
        }  
        return mod.select(path);
    }

    selectnew(lib: string, path: string[]) {
        let core = this.get(lib, path);
        this.selectCore(core);
        return this.selected;
    }

    find(fragment: string[]) : FunctionShim | Widget | undefined {
        // TODO 'get()' is precise, 'find()' is not. logic.and -> Logic.And, should not matter, as long as it is unambiguous
        // TODO make this less precise. A search for 'and' should yield something in the std tree with and

        let core = this.std.find(fragment);
        if (core) return core;

        if (fragment.length == 1) {
            // no lib approach
            let names = [fragment[0].toLowerCase()];

            for (let lib of this.modules.keys()) {
                console.log(lib);
                let core = this.get(lib, names); 
                if (core) return core;
                
            } 
            return undefined;
        } else {
            // with lib approach
            // let names = fragments.slice(1).map(s => s.toLowerCase());
            let library = fragment[0].toLowerCase();
            let core = this.get(library, fragment.slice(1));
            if (!core) {
                console.warn("no blueprint found");
                return undefined;
            }
            return core;
        }
    }

    selectCore(core: FunctionShim | Widget | undefined) {
        this.selected = core;
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
        // lib.publishGlobally();
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