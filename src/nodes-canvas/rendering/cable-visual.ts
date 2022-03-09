import { Vector2 } from "../../../../engine/src/lib";
import { Socket } from "../model/socket";

export enum CableState {
    Null,
    Selected,
    Object,
    String,
    Number,
    Boolean,
    Dragging,
}

export class CableVisual {
    constructor(
        public socket: Socket,
        public polyline: any,
        public state: CableState,
        
    ) {

    }

    isTouching(gp: Vector2) {
        return false;
    }
}