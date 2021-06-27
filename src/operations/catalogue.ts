import { GizmoNode, GizmoCore } from "../gizmos/_gizmo";
import { defaultGizmos, defaultOperations } from "./default-catalogue";
import { NodeCore } from "../graph/node-core";
import { FN, OperationCore } from "./operation";
import { OpNode } from "../graph/node";
import { Vector2 } from "../../../engine/src/lib";

/**
 * Catalogue containing all cores
 * Cores contain functionality of a node
 * 
 * In the future, this would make creating a menu easier
 * TODO: Categories
 */
export class Catalogue {

    public selected?: NodeCore

    constructor(public operations: OperationCore[], public gizmos: GizmoCore[]) {

    }

    static new(ops: OperationCore[], giz: GizmoCore[]) : Catalogue {
        return new Catalogue(ops, giz);
    }

    static newDefault() {
        let operations: OperationCore[] = defaultOperations.map(fn => OperationCore.new(fn));
        let gizmos: GizmoCore[] = defaultGizmos;
        return Catalogue.new(operations, gizmos);
    }

    select(idx?: number, gizmo?: boolean) {
        
    }

    createSelectedNode(gp: Vector2) {
        if (this.selected instanceof OperationCore) {
            return OpNode.new(gp, this.selected);
        }
        return undefined;
    }
}