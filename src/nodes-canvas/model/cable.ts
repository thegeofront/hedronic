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
 * A cable, or datum. Cables are directly linked to the data they carry
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

    static new(state: State, style: CableStyle) {
        return new Cable(undefined, undefined, state, 0, style);
    }

    set(state: State, style: CableStyle) {
        this.state = state;
        this.style = style;
    }
}

