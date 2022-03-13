import { TypeShim } from "../../modules/shims/type-shim";

/**
 * A blueprint for a special, unique type of node, with unique functionalities
 * 
 */
export class Widget {
    public nameLower: string;

    constructor(
        public readonly name: string,
        public readonly path: string[],
        public func: Function,
        public ins: TypeShim[],
        public outs: TypeShim[],
        ) {
        this.nameLower = name.toLowerCase();
    }
}