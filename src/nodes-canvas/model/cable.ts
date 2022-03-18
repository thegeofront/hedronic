import { TypeShim } from "../../modules/shims/type-shim";
import { Socket } from "./socket";
import { State } from "./state";

export enum CableStyle {
    Off,
    On,
    Selected,
    Dragging,
    Invalid,
    List1,
    List2,
    List3,
    List4,
}

/**
 * A Cable, or Datum. Cables are directly linked to the data they carry
 * Cables live at the output sockets of nodes. 
 */
export class Cable {

    constructor(
        public start: Socket | undefined,
        public ends: Socket[],

        public type: TypeShim | undefined,
        public state: State,
        public level: number,
        public valid: boolean,

        public style: CableStyle,
        // public polyline?: any,
    ) {}

    static new(type: TypeShim) {
        return new Cable(undefined, [], type, false, 0, true, CableStyle.Off);
    }

    setState(state: State) {

        let style = CableStyle.Off;
        if (state instanceof Array) {
            style = CableStyle.List1;
        }else if (state) {
            style = CableStyle.On;
        } 

        this.state = state;
        this.style = style;
    }

    elevate() {

    }

    flatten() {

    }
}

