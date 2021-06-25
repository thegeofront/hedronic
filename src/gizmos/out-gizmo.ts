import { Vector2 } from "../../../engine/src/lib";
import { GizmoType } from "./_gizmo";

export class OutGizmo extends GizmoType {
 
    private constructor() {
        super("Out", Vector2.new(1,1));
    }

    static new() {
        return new OutGizmo();
    }   
}