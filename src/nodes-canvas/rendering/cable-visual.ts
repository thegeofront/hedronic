import { Vector2 } from "../../../../engine/src/lib";
import { Socket } from "../components/socket";

export enum CableState {
    Null,
    Selected,
    Object,
    String,
    Number,
    Boolean,
}

export class CableVisual {
    constructor(
        public pointer: Socket,
        public polyline: any
        
    ) {

    }

    isTouching(gp: Vector2) {
        return false;
    }
}