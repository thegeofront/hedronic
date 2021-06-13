import { Operation } from "./operation";


/**
 * Catalogue containing all operations 
 * TODO: Categories
 */
export class Catalogue {

    constructor(public ops: Operation[]) {
        
    }

    static new(ops: Operation[]) : Catalogue {
        return new Catalogue(ops);
    }
}