import { State } from "../../nodes-canvas/model/state";
import { TypeShim } from "./type-shim";

/**
 * NOTE: dont know if this will be used, but its an idea!
 * NOTE2: this looks like a cable!
 * NOTE3: This is unnused right now, why does it exist?
 */
export class Variable {

    constructor(
        public value: State,
        public type: TypeShim, 
    ) {}
}