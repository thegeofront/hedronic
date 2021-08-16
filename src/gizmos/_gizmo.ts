// author:      Jos Feenstra 
// purpose:     We make a distinction between 'normal' nodes, and gizmo's. 
//              gizmo's are directly tied to one and only one cable.
//              used as:
//                - global input
//                - global output
//                - visuals
//                - cable management
//
//              also, only gizmo's are allowed to hold state. 
//              

import { Vector2 } from "../../../engine/src/lib";
import { CTX } from "../nodes/nodes-controller";
import { ButtonGizmo } from "./button-gizmo";
import { PreviewGizmo } from "./preview-gizmo";

// prototype pattern
export class GizmoCore {

    protected constructor(
        public name: string,
        public size: Vector2,

    ) {}

    getState() {

    }

    renderAddition(ctx: CTX, gizmo: GizmoNode) {
        
    }
}


export class GizmoNode {

    private constructor(
        public state: boolean,
        public core: GizmoCore,
        public position: Vector2) {}

    static new(position: Vector2, kind: GizmoCore) : GizmoNode {
        let size = Vector2.new(1,1);
        let state = false;
        return new GizmoNode(state, kind, position);
    }
}