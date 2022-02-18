import { WebIO } from "../../../../engine/src/lib";
import { ModuleShim } from "../shims/library-shim";
import { DTSLoading } from "./dts-loading";

export namespace JSLoading {

    export async function loadModule(path: string) {
        let code = await WebIO.getText(path);
        return compileModule(code);
    }

    export async function compileModule(code: string) {

        let url = URL.createObjectURL(new Blob([code], {type: 'text/javascript'}));
        
        // @ts-ignore
        let res = await import(/* webpackIgnore: true */ url);

        return res;
    }
}