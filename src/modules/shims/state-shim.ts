import { State } from "../../nodes-canvas/model/state";
import { TypeShim } from "./type-shim";

/**
 * NOTE: dont know if this will be used, but its an idea!
 * NOTE2: this looks like a cable!
 */
export class Parameter {

    constructor(
        public value: State,
        public type: TypeShim, 
    ) {}
}