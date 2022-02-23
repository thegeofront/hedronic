import { Catalogue } from "./catalogue";
import { IO } from "../nodes-canvas/util/io";
import { ModuleShim } from "./shims/module-shim";
import { WasmLoading } from "./helpers/wasm-loading";
import { DTSLoading } from "./helpers/dts-loading";
import { JSLoading } from "./helpers/js-loading";
import ts from "typescript";
import { TypeShim } from "./shims/parameter-shim";
import { Misc } from "../nodes-canvas/util/misc";

export namespace ModuleLoading {
    
    /** 
     * - read the json
     * - create libraries
     * - put them in a Catalogue
     * */ 
    export async function loadModulesToCatalogue(stdPath: string) {

        let catalogue = Catalogue.newFromWidgets();   

        let json = await IO.fetchJson(stdPath);

        // load new modules 
        for (let config of json.std) {
            const icon = config.icon;
            const nickname = config.nickname;
            const jsPath = config.path + config.filename + ".js";
            const dtsPath = config.path + config.filename + ".d.ts";

            console.log(jsPath);
            
            const {js, syntaxTree} = await loadModule(jsPath, dtsPath);
            const module = await loadShimModule(js, jsPath, syntaxTree, nickname, icon);
            catalogue.addLibrary(module);
        }

        // load wasm modules 
        for (let config of json.wasm) {
            let module = await loadWasmModule(config);
            if (module) {
                catalogue.addLibrary(module);
            }
        }

        return catalogue
    }


    export async function loadWasmModule(config: any) {

        const icon = config.icon;
        const nickname = config.nickname;

        const jsPath = config.localPath + config.filename + ".js";
        const dtsPath = config.localPath + config.filename + ".d.ts";
        const wasmPath = config.localPath + config.filename + "_bg.wasm";
        
        const typeBlacklist = Misc.setFromList(["InitInput", "InitOutput"]);
        const funcBlacklist = Misc.setFromList(["init", "free"]);

        const {js, syntaxTree} = await WasmLoading.moduleFromWasmPack(jsPath, dtsPath, wasmPath);
        
        let types = new Map<string, TypeShim>();
        
        types = DTSLoading.extractTypeDeclarations(syntaxTree, types, typeBlacklist);
        console.log(types);
        
        let shims = DTSLoading.extractFunctionShims(syntaxTree, nickname, js, types, funcBlacklist);
        const module = ModuleShim.new(nickname, icon, jsPath, js, shims, []);

        console.log(shims);

        return module;
    }


    export async function loadModule(jsPath: string, dtsPath: string) {
        let js = await JSLoading.loadModule(jsPath);
        let syntaxTree = await DTSLoading.load(dtsPath, {});

        return {js, syntaxTree};
    }

    /**
     * The loading procedure of one module
     */
    export async function loadShimModule(
        jsModule: any, 
        jsPath: string, 
        syntaxTree: ts.SourceFile, 
        nickname: string, 
        icon: string, 
        types= new Map<string, TypeShim>(), 
        ) {
        
        types = DTSLoading.extractTypeDeclarations(syntaxTree, types);
        let shims = DTSLoading.extractFunctionShims(syntaxTree, nickname, jsModule, types);

        // use the source map to find types
        
        // use the source map to find functions 

        // 

        // console.log(libObj, sourceMap);

        const module = ModuleShim.new(nickname, icon, jsPath, jsModule, shims, []);

        return module;
    }
}