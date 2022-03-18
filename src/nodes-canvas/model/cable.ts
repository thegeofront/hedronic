import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
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
 * A Cable, or Datum. 
 * 3 responsibilities tied together: connectivity, state management, visuals
 */
export class Cable {

    constructor(
        // 1 | connectivity (TODO)
        public start: Socket | undefined, // this should never be undefined
        public ends: Socket[],

        // 2 | state management
        public type: TypeShim,
        public state: State,
        public level: number,
        public valid: boolean,

        // 3 | visuals
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
}

