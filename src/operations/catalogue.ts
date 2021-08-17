import { defaultGizmos, defaultOperations } from "./default-catalogue";
import { FN, OperationCore } from "./operation-core";
import { OpNode } from "../graph/node";
import { Vector2 } from "../../../engine/src/lib";

// TODO rename CORE to TYPE
//      rename NODE to INSTANCE maybe


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

    public selected?: OperationCore

    constructor(public operations: OperationCore[], public gizmos: OperationCore[]) {

    }

    static new(ops: OperationCore[], giz: OperationCore[]) : Catalogue {
        return new Catalogue(ops, giz);
    }

    static newDefault() {
        let operations: OperationCore[] = defaultOperations.map(fn => OperationCore.new(fn));
        let gizmos: OperationCore[] = defaultGizmos.map(fn => OperationCore.new(fn));
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
        } 
    }
}