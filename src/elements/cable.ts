import { Comp, GUID } from "./graph";

export class Cable {

    private constructor(
        public from: GUID, 
        public fromComp: Comp, 
        public to: GUID, 
        public toComp: Comp) {}

    static new(a: GUID, aComp: Comp, b: GUID, bComp: Comp) {
        if (aComp < bComp) {
            return new Cable(b, bComp, a, aComp);
        }
        return new Cable(a, aComp, b, bComp);
    }
}