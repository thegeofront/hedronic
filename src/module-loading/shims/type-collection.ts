import { TypeShim } from "./type-shim";

/**
 * We dont want duplicate types, and we want to know if a type exists, that sort of thing
 */
export class TypeShimCollection {

    constructor(
        public types: Map<string, TypeShim> = new Map(),
    ) {

    }
}