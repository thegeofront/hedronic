import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { NodesGraph } from "./graph";
import { Socket } from "./socket";
import { State } from "./state";

export enum CableStyle {
    Off,
    On,
    Selected,
    Dragging,
    Invalid,
    List,
    SelectedList,
}

/**
 * A Cable, or Datum. 
 * 3 responsibilities tied together: connectivity, state management & visuals
 */
export class Cable {

    constructor(
        // 1 | connectivity (TODO)
        public start: Socket | undefined, // this should never be undefined
        public ends: Socket[],

        // 2 | state management
        public type: TypeShim,
        public _state: State,
        public level: number, // [JF] I don't know  
        public valid: boolean, // valid as in type
        public _outdated: boolean = false,

        // 3 | visuals
        public style: CableStyle = CableStyle.Off,
        // public polyline?: any,
    ) {}

    static new(type: TypeShim) {
        return new Cable(undefined, [], type, false, 0, true);
    }

    /**
     * remove all connections & references to this cable
     */
    disconnect(graph: NodesGraph) {
        // TODO
    }

    flagAsOutdated() {
        this._outdated = true;
    }

    setState(state: State) {
        // determine visual based on state
        let style = CableStyle.Off;
        if (state instanceof Array) {
            style = CableStyle.List;
            this.type.type = Type.List;
        }else if (state) {
            style = CableStyle.On;
        } 
        this.style = style;

        this._state = state;
        this._outdated = false;
    }

    getState() {
        return this._state;
    }
}

