import { Socket } from "./socket";

export class Cable {

    private constructor(
        public from: Socket, 
        public to: Set<Socket>) {}

    static new(a: Socket, b: Socket) : Cable {
        if (a.idx < b.idx) {
            return Cable.new(b, a);
        } else {
            return new Cable(a, new Set([b]));
        }
    }
}