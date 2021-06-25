import { Vector2 } from "../../../engine/src/lib";
import { CTX } from "../nodes/nodes-controller";
import { Gizmo, GizmoType } from "./_gizmo";

export class PreviewGizmo extends GizmoType {
    
    private constructor() {
        super("Preview", Vector2.new(1,1));
    }

    static new() {
        return new PreviewGizmo();
    }   

    getState() {
        
    }

    renderAddition(ctx: CTX, gizmo: Gizmo, ) {
        
    }

    // render a button
    // if it is pressed,
    //   change state,
    //   fire up a recalculation & redraw
}