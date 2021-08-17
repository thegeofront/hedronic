import { OperationCore } from "../operations/operation-core";
import { Socket } from "./socket";

export class Cable {

    private constructor(
        public from: Socket, 
        public gizmos: OperationCore[],
        public _to: Map<string, Socket>) {}

    static new(a: Socket, b: Socket) : Cable {
        if (a.idx < b.idx) {
            return Cable.new(b, a);
        } else {
            let map = new Map<string, Socket>();
            let gizmos: OperationCore[] = [];
            map.set(b.toString(), b);
            return new Cable(a, gizmos, map);
        }
    }

    get to() {
        return this._to.values();
    }

    add(s: Socket) {
        this._to.set(s.toString(), s);
    }
}