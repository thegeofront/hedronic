import { Type, TypeShim } from "./parameter-shim";

/**
 * NOTE: dont know if this will be used, but its an idea!
 */
export class StateShim {

    constructor(
        public state: any,             // the data to represent this state
        public location: TypeShim, // the variable the state occupies. it can hop from 
    ) {

    }
}