import { Vector2 } from "../../../engine/src/lib";
import { GizmoType } from "./_gizmo";

export class InGizmo extends GizmoType {
    
    private constructor() {
        super("In", Vector2.new(1,1));
    }

    static new() {
        return new InGizmo();
    }

    // render a button
    // if it is pressed,
    //   change state,
    //   fire up a recalculation & redraw 
}