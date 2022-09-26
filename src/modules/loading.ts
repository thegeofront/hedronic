import { Catalogue } from "./catalogue";
import { IO } from "../nodes-canvas/util/io";
import { ModuleShim } from "./shims/module-shim";
import { WasmLoading } from "./helpers/wasm-loading";
import { DTSLoading } from "./helpers/dts-loading";
import { JSLoading } from "./helpers/js-loading";
import ts from "typescript";
import { TypeShim } from "./shims/type-shim";
import { Misc } from "../nodes-canvas/util/misc";
import { getStandardTypesAsDict } from "./types/registry";
import { Debug } from "../../../engine/src/lib";
import { URL } from "../util/url";
import { ModuleMetaData, ModuleSource } from "./shims/module-meta-data";

const CDN = "https://cdn.jsdelivr.net/npm";

export namespace ModuleLoading {
    
    /** 
     * - read the json
     * - create libraries
     * - put them in a Catalogue
     * 
     * NOTE: this is now the old way of doing things
     * */ 
    export async function loadModulesToCatalogue(stdPath: string) {

        // get the catalogue, fill it with standard widgets & types
        let catalogue = Catalogue.default();   
        let json = await IO.fetchJson(stdPath);

        // load new modules 
        for (let config of json.std) {
            const icon = config.icon;
            const nickname = config.nickname;
            const jsPath = config.path + config.filename + ".js";
            const dtsPath = config.path + config.filename + ".d.ts";
            
            let meta = new ModuleMetaData(
                ModuleSource.JavaScript,
                nickname,
                config.filename,
                nickname,
                "",
                config.path,
                icon,
                jsPath,
                dtsPath,
                "",
            )

            const {js, syntaxTree} = await loadModule(jsPath, dtsPath, config.filename);
            const {module, types} = await loadShimModule(meta, catalogue.types, js, syntaxTree);

            catalogue.addLibrary(module);
            catalogue.types = types;
        }

        // load wasm modules 
        for (let config of json.wasm) {
            const icon = config.icon;
            const nickname = config.nickname;
            let base = "";
    
            // this is a dumb, error-prone hack
            // I think i'm doing this to load a locally saved module.
            if (!config.path.includes("http")) {
                base = URL.getBase();
            }
    
            const jsPath = base + config.path + config.filename + ".js";
            const dtsPath = base + config.path + config.filename + ".d.ts";
            const wasmPath = base + config.path + config.filename + "_bg.wasm";

            let meta = new ModuleMetaData(
                ModuleSource.JavaScript,
                nickname,
                config.filename,
                nickname,
                "",
                config.path,
                icon,
                jsPath,
                dtsPath,
                wasmPath,
            )

            let {module, types} = await loadWasmModule(meta, catalogue.types);
            if (module) {
                catalogue.addLibrary(module);
                catalogue.types = types!;
            } else {
                Debug.warn("could not load module: " + config.nickname + " ...");
            }
        }

        return catalogue
    }

    export async function loadModulesFromDependencyJson(depJson: any, catalogue = Catalogue.default()) {

        // load wasm modules 
        for (let nickname in depJson) {

            if (catalogue.modules.has(nickname)) {
                Debug.warn("duplicate library!");
                continue;
            }

            let meta = ModuleMetaData.fromIncompleteJson(nickname, depJson[nickname]);   
            let {module, types} = await loadWasmModule(meta, catalogue.types);
            if (module) {
                catalogue.addLibrary(module);
                catalogue.types = types!;
            } else {
                Debug.error("something went wrong while loading: " + nickname + " ... ");
            }
        }
        return catalogue;
    }


    export async function loadWasmModule(
        meta: ModuleMetaData,
        types = new Map<string, TypeShim>()
    ) {

        // TODO expand on this
        const typeBlacklist = Misc.setFromList(["InitInput", "InitOutput", "SyncInitInput"]);
        const funcBlacklist = Misc.setFromList(["init", "free", "initSync", "initsync"]);

        const res = await WasmLoading.moduleFromWasmPack(meta.jsPath, meta.dtsPath, meta.wasmPath).catch((e) => {
            Debug.warn(e);
            return undefined;
        });

        if (!res) {
            return {module: undefined, types: undefined};
        }

        const {js, syntaxTree} = res;

        types = DTSLoading.extractTypeDeclarations(syntaxTree, types, typeBlacklist);
        // console.log(types);
        
        let shims = DTSLoading.extractFunctionShims(syntaxTree, meta.nickname, js, types, funcBlacklist);
        const module = ModuleShim.new(meta, js, shims, []);

        return {module, types};
    }


    export async function loadModule(
        jsPath: string, 
        dtsPath: string, 
        dtsName: string
    ) {
        // console.log("loading", jsPath, "and", dtsPath)
        let js = await JSLoading.loadModule(jsPath);
        let syntaxTree = await DTSLoading.load(dtsPath, dtsName, {});

        return {js, syntaxTree};
    }

    /**
     * The loading procedure of one module
     */
    export async function loadShimModule(
        meta: ModuleMetaData, 
        types= new Map<string, TypeShim>(), 
        jsModule: any, 
        syntaxTree: ts.SourceFile, 
    ) {
        
        types = DTSLoading.extractTypeDeclarations(syntaxTree, types);
        let shims = DTSLoading.extractFunctionShims(syntaxTree, meta.nickname, jsModule, types);
        const module = ModuleShim.new(meta, jsModule, shims, []);

        return {module, types};
    }
}

