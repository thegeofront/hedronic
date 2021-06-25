// author:      Jos Feenstra 
// purpose:     We make a distinction between 'normal' nodes, and gizmo's. 
//              gizmo's are directly tied to one and only one cable.
//              used as:
//                - input
//                - output
//                - visuals
//                - cable management
//
//              also, only gizmo's are allowed to hold state. 

import { Vector2 } from "../../../engine/src/lib";
import { ButtonGizmo } from "./button-gizmo";
import { PreviewGizmo } from "./preview-gizmo";

// prototype pattern
export class GizmoType {

    protected constructor(
        public name: string,
        public size: Vector2,

    ) {}

    getState() {

    }

}


export class Gizmo {

    private constructor(
        public cable: string,
        public state: boolean,
        public type: GizmoType,
        public position: Vector2) {}

    static new(cable: string, position: Vector2, kind: GizmoType) : Gizmo {
        let size = Vector2.new(1,1);
        let state = false;
        return new Gizmo(cable, state, kind, position);
    }
}