import { Vector2 } from "../../../engine/src/lib";
import { GizmoCore } from "./_gizmo";

export class InGizmo extends GizmoCore {
    
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