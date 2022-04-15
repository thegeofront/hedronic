import { FunctionShim } from "../../modules/shims/function-shim";

export abstract class GFType {
    abstract getFunctionShims(): FunctionShim[];
    abstract fromJson(json: any): any;
};