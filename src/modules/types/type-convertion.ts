import { TypeShim } from "../shims/type-shim";
import { JsType } from "./type";

export namespace TypeConvertion {

    export function tryConvert(given: any, givenType: JsType, neededType: JsType) : any {
        if (givenType == neededType) return given;
        // switch (given)

    }
}