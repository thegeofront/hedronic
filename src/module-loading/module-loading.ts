import { Catalogue } from "./catalogue";
import { IO } from "../nodes-canvas/util/io";
import { LibraryShim } from "./shims/library-shim";
import { WasmLibraryShim } from "./shims/wasm-shim";

export namespace ModuleLoading {
    
    // read the json, create libraries
    export async function loadModulesToCatalogue(stdPath: string) {

        let catalogue = Catalogue.newFromWidgets();   

        // TODO move this to Catalogue, its catalogue's responsibility to manage modules
        let json = await IO.fetchJson(stdPath);
        for (let config of json.std) {
            let libObj = await IO.importLibrary(config.path);
            let mod = LibraryShim.fromJsObject(config.name, config.icon, config.fullPath, config.path, libObj, catalogue);
            catalogue.addLibrary(mod);
        }

        for (let config of json.wasm) {

            const jsPath = config.localPath + config.filename + ".js";
            const dtsPath = config.localPath + config.filename + ".d.ts";
            const wasmPath = config.localPath + config.filename + "_bg.wasm";

            WasmLibraryShim.new(jsPath, dtsPath, wasmPath);
        }

        return catalogue
    }
}