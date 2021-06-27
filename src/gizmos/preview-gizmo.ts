import { Vector2 } from "../../../engine/src/lib";
import { CTX } from "../nodes/nodes-controller";
import { GizmoNode, GizmoCore } from "./_gizmo";

export class PreviewGizmo extends GizmoCore {
    
    private constructor() {
        super("Preview", Vector2.new(1,1));
    }

    static new() {
        return new PreviewGizmo();
    }   

    getState() {
        
    }

    renderAddition(ctx: CTX, gizmo: GizmoNode, ) {
        
    }

    // render a button
    // if it is pressed,
    //   change state,
    //   fire up a recalculation & redraw
}