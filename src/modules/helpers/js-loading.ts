import { WebIO } from "../../../../engine/src/lib";
import { State } from "../../nodes-canvas/model/state";
import { ModuleShim } from "../shims/library-shim";
import { DTSLoading } from "./dts-loading";

export type FN = (...args: State[]) => State[];

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

    
    // ---- util

    export function countInputsFromRawFunction(operation: Function) {
        return operation.length;
    }

    export function countOutputsFromRawFunction(operation: Function) {
        // HACK: its hard to determine the number of outputs, so im directly reading the string of the operation, 
        // and derriving it from the number of comma's found in the return statement.
        // this could create some nasty unforseen side effects...
        let getOutput = /return.*(\[.*\]).*/
        let match = getOutput.exec(operation.toString()) || "";
        let output = match[1];
        if (!output) {
            return 1;
        }
        if (output == "[]") {
            return 0;
        }

        let count = output.split(',').length;
        
        return count;
    }
}