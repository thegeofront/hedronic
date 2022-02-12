import { mapFromJson, mapToJson } from "../util/serializable";
import { Socket } from "./socket";

export enum CableState {
    Null,
    Selected,
    Object,
    String,
    Number,
    Boolean,
}

export class Cable {

    private constructor(
        public from: Socket,
        public _to: Map<string, Socket> = new Map(),
        public state: CableState) {}

    static new(a: Socket, b: Socket) : Cable {
        if (a.idx < b.idx) {
            return Cable.new(b, a);
        } else {
            let c = new Cable(a, new Map(), CableState.Null);
            c.add(b)
            return c;
        }
    }
    
    static fromJson(json: any) {
        let from = Socket.fromJson(json.from);
        let map = mapFromJson(json.to, Socket.fromJson);
        return new Cable(from, map, CableState.Null);
    }

    static toJson(c: Cable) {
        return {
            from: Socket.toJson(c.from),
            to: mapToJson(c._to, Socket.toJson),
            state: c.state as number,
        }
    }

    get to() {
        return this._to.values();
    }

    add(s: Socket) {
        this._to.set(s.toString(), s);
    }
}