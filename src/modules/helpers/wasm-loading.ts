import { WebIO } from "../../../../engine/src/lib";
import { ModuleShim } from "../shims/module-shim";
import { DTSLoading } from "./dts-loading";

export namespace WasmLoading {

    export async function moduleFromWasmPack(jsPath: string, dtsPath: string, wasmPath: string) {
        console.log("creating a wasm shim")
        let sourceMap = await DTSLoading.load(dtsPath, {});
        let code = await WebIO.getText(jsPath);
        // let fakeWasmPath = "wasm-modules/cityjson_validator_bg.wasm";
        let wasmModule = fetch(wasmPath);
        let url = URL.createObjectURL(new Blob([code], {type: 'text/javascript'}));
        
        //@ts-ignore
        let module = await import(/* webpackIgnore: true */url);
        
        // init the module
        let lowLevelModule = await module.default(wasmModule);

        // console.log(module["CityJsonValidator"]["new_from_string"](""));

        // console.log({sourceMap, module: lowLevelModule, res: module})
        


        return undefined;

        //@ts-ignore
        // window.js = js;

        //* webpackIgnore: true */
        
        // let js = await eval(code);

        // let js = /* webpackIgnore: true */require(/* webpackIgnore: true */jsPath);
        // console.log(js);
        
        //@ts-ignore
        // js.default();

        // console.log(js);
        // console.log();
    }
}