import { FunctionShim } from "../../modules/shims/function-shim";
import { Widget } from "./widget";

export enum CoreType {
    Operation,
    Widget
}

export type Core = FunctionShim | Widget;
