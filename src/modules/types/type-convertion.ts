import { TypeShim } from "../shims/type-shim";
import { Type } from "./type";

export namespace TypeConvertion {

    export function tryConvert(given: any, givenType: Type, neededType: Type) : any {
        if (givenType == neededType) return given;
        // switch (given)

    }
}