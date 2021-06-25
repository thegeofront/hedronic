import { Gizmo, GizmoType } from "../gizmos/_gizmo";
import { Operation } from "./operation";


/**
 * Catalogue containing all operations 
 * In the future, this would make creating a menu easier
 * TODO: Categories
 */
export class Catalogue {

    constructor(public ops: Operation[], public giz: GizmoType[]) {

    }

    static new(ops: Operation[], giz: GizmoType[]) : Catalogue {
        return new Catalogue(ops, giz);
    }
}