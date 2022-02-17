import { Catalogue } from "./catalogue";
import { IO } from "../nodes-canvas/util/io";
import { LibraryShim } from "./shims/library-shim";

export namespace ModuleLoading {
    
    export async function loadModulesToCatalogue(stdPath: string) {

        let catalogue = Catalogue.newFromWidgets();   

        // TODO move this to Catalogue, its catalogue's responsibility to manage modules
        let json = await IO.fetchJson(stdPath);
        for (let config of json.std) {
            let libString = await IO.importLibrary(config.path);
            let mod = LibraryShim.fromJsObject(config.name, config.icon, config.fullPath, config.path, libString, catalogue);
            catalogue.addLibrary(mod);
        }

        for (let config of json.wasm) {

            // const jsPath = config.local
            // const dtsPath = config.

            console.log(config);
        }

        return catalogue
    }
}