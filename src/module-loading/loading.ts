import { Catalogue } from "./catalogue";
import { IO } from "../nodes-canvas/util/io";
import { ModuleShim } from "./shims/library-shim";
import { WasmLoading } from "./helpers/wasm-loading";
import { DTSLoading } from "./helpers/dts-loading";
import { JSLoading } from "./helpers/js-loading";
import { createSolutionBuilder } from "typescript";

export namespace ModuleLoading {
    
    /** 
     * - read the json
     * - create libraries
     * - put them in a Catalogue
     * */ 
    export async function loadModulesToCatalogue(stdPath: string) {

        let catalogue = Catalogue.newFromWidgets();   

        let json = await IO.fetchJson(stdPath);
        
        // load old modules for now 
        for (let config of json.std_old) {
            let libObj = await IO.importLibrary(config.path);
            let mod = ModuleShim.fromJsObject(config.name, config.icon, config.fullPath, config.path, libObj, catalogue);
            catalogue.addLibrary(mod);
        }

        // load new modules 
        for (let config of json.std) {
            const jsPath = config.path + config.filename + ".js";
            const dtsPath = config.path + config.filename + ".d.ts";

            console.log(jsPath);

            const module = loadShimModule(jsPath, dtsPath);

            // let mod = ModuleShim.fromJsObject(config.name, config.icon, config.fullPath, config.path, libObj, catalogue);
            // catalogue.addLibrary(mod);
        }

        // load wasm modules 
        for (let config of json.wasm) {

            const jsPath = config.localPath + config.filename + ".js";
            const dtsPath = config.localPath + config.filename + ".d.ts";
            const wasmPath = config.localPath + config.filename + "_bg.wasm";

            // const module = WasmLoading.moduleFromWasmPack(jsPath, dtsPath, wasmPath);

        }

        return catalogue
    }


    /**
     * The loading procedure of one module
     */
    export async function loadShimModule(jsPath: string, dtsPath: string) {
        
        let libObj = await JSLoading.loadModule(jsPath);
        let sourceMap = await DTSLoading.load(dtsPath, {});

        // use the source map to find types
        
        // use the source map to find functions 

        // 

        // console.log(libObj, sourceMap);

        return true;
    }
}