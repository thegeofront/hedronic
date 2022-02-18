import { IO, WebIO } from "../../../../engine/src/lib";
import { DTSLoading } from "../helpers/dts-loading";
import { JSLoading } from "../helpers/js-loading";

export class WasmLibraryShim {

    constructor() {

    }

    static async getModuleAndSourceMap() {

    }

    static async new(jsPath: string, dtsPath: string, wasmPath: string) {
        console.log("creating a wasm shim")
        let sourceMap = await DTSLoading.load(dtsPath, {});
        let code = await WebIO.getText(jsPath);
        // let fakeWasmPath = "wasm-modules/cityjson_validator_bg.wasm";
        let wasmModule = fetch(wasmPath);
        let url = URL.createObjectURL(new Blob([code], {type: 'text/javascript'}));
        
        //@ts-ignore
        let res = await import(/* webpackIgnore: true */url);
        let module = await res.default(wasmModule);

        console.log({sourceMap, module})
        
        return false;

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