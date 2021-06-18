import { Operation } from "./operation";


/**
 * Catalogue containing all operations 
 * In the future, this would make creating a menu easier
 * TODO: Categories
 */
export class Catalogue {

    constructor(public ops: Operation[]) {
        
    }

    static new(ops: Operation[]) : Catalogue {
        return new Catalogue(ops);
    }
}