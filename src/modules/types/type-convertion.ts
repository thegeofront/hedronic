import { TypeShim } from "../shims/type-shim";
import { PluginConversion } from "./rust-conversion";
import { GeoType, JsType } from "./type";

export namespace TypeConvertion {

    export function tryConvertTo(data: any, neededType: JsType) : any {
        
        if (neededType == JsType.Object && 
            PluginConversion.isTyped(data) && 
            PluginConversion.isConvertableTo(data, GeoType.Json)) {
            console.log("yayayayya convert!");
            data = PluginConversion.tryConvertTo(data, GeoType.Json);
        }
        // if (givenType == neededType) return given;
        // switch (given)
        return data;
    }
}