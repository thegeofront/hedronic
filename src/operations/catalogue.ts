import { GizmoNode, GizmoCore } from "../gizmos/_gizmo";
import { defaultGizmos, defaultOperations } from "./default-catalogue";
import { NodeCore } from "../graph/node-core";
import { FN, OperationCore } from "./operation-core";
import { OpNode } from "../graph/node";
import { Vector2 } from "../../../engine/src/lib";

// TODO rename CORE to TYPE
//      rename NODE to INSTANCE maybe

export type AnyCore = OperationCore | GizmoCore;
export type AnyNode = OpNode | GizmoNode;
export enum CoreType {
    Operation,
    Gizmo
}

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

    select(idx: number, type: CoreType) {
        
        console.log(`select id: ${idx} type: ${type}`);
        if (type == CoreType.Operation) {
            this.selected = this.operations[idx];
        } else {
            this.selected = this.gizmos[idx];
        }
    }

    deselect() {
        this.selected = undefined;
    }

    /**
     * Spawn an instance of the selected node at a location 
     */
    spawn(gp: Vector2) {
        console.log("create");
        if (this.selected instanceof OperationCore) {
            return OpNode.new(gp, this.selected);
        } else if (this.selected instanceof GizmoCore) {
            return GizmoNode.new(gp, this.selected);
        } else {
            return undefined;
        }
    }
}