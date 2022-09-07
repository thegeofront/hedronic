import { WebIO } from "../../../../engine/src/lib";
import { ModuleShim } from "../shims/module-shim";
import { DTSLoading } from "./dts-loading";

export namespace WasmLoading {

    /**
     * NOTE: I know, this is insane...
     */
    export async function moduleFromWasmPack(jsPath: string, dtsPath: string, wasmPath: string) {
        // console.log("creating a wasm shim")
        let code = await WebIO.getText(jsPath);

        // let fakeWasmPath = "wasm-modules/cityjson_validator_bg.wasm";
        let wasmModule = fetch(wasmPath);
        let url = URL.createObjectURL(new Blob([code], {type: 'text/javascript'}));
        
        console.log("loading things from:", jsPath, dtsPath, wasmPath);

        //@ts-ignore
        let module = await import(/* webpackIgnore: true */url);
        if (!module) throw new Error("module not found at: " +  url);

        // init the module
        let syntaxTree = await DTSLoading.load(dtsPath, dtsPath, {});
        let js = await module.default(wasmModule);
        if (js.start) {
            js.start();
        }
        return {js: module, syntaxTree};

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