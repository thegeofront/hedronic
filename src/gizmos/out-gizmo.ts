import { Vector2 } from "../../../engine/src/lib";
import { GizmoCore } from "./_gizmo";

export class OutGizmo extends GizmoCore {
 
    private constructor() {
        super("Out", Vector2.new(1,1));
    }

    static new() {
        return new OutGizmo();
    }   
}