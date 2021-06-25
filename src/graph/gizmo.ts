// author:      Jos Feenstra 
// purpose:     We make a distinction between 'normal' nodes, and gizmo's. 
//              gizmo's are directly tied to one and only one cable.
//              used as:
//                - input
//                - output
//                - visuals
//                - cable management

import { Vector2 } from "../../../engine/src/lib";

export class Gizmo {

    private constructor(
        public cable: string,
        public position: Vector2,
        public size: Vector2) {}

    static new(cable: string, position: Vector2) : Gizmo {
        let size = Vector2.new(1,1);
        return new Gizmo(cable, position, size);
    }
    
}