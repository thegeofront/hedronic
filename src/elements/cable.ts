import { Connector } from "./graph";

export class Cable {

    private constructor(
        public from: Connector, 
        public to: Set<Connector>) {}

    static new(a: Connector, b: Connector) : Cable {
        if (a.idx < b.idx) {
            return Cable.new(b, a);
        } else {
            return new Cable(a, new Set([b]));
        }
    }
}