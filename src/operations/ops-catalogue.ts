import { GizmoNode, GizmoCore } from "../gizmos/_gizmo";
import { OperationCore } from "./operation";


/**
 * Catalogue containing all operations 
 * In the future, this would make creating a menu easier
 * TODO: Categories
 */
export class Catalogue {

    constructor(public ops: OperationCore[], public giz: GizmoCore[]) {

    }

    static new(ops: OperationCore[], giz: GizmoCore[]) : Catalogue {
        return new Catalogue(ops, giz);
    }
}