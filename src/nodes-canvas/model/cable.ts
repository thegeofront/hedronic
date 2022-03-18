import { TypeShim } from "../../modules/shims/type-shim";
import { Socket } from "./socket";
import { State } from "./state";

export enum CableStyle {
    Off,
    On,
    Selected,
    Dragging,
    Level1,
    Level2,
    Level3,
    Object,
}

/**
 * A Cable, or Datum. Cables are directly linked to the data they carry
 * Cables live at the output sockets of nodes. 
 */
export class Cable {

    constructor(
        public start: Socket | undefined,
        public type: TypeShim | undefined,
        public state: State,
        public level: number, // level: 0 -> type: T | level: 1 -> type: Array<T> | level: 2 -> type: Array<Array<T>>
        
        public style: CableStyle,
        // public polyline?: any,
    ) {}

    static new() {
        return new Cable(undefined, undefined, false, 0, CableStyle.Off);
    }

    setState(state: State) {

        let style = CableStyle.Off;
        if (state) {
            style = CableStyle.On;
        } 

        this.state = state;
        this.style = style;
    }
}

