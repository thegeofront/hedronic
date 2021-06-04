import { GUID } from "./graph";

export class Cable {

    private constructor(public from: GUID, public to: GUID) {}

    static new(from: GUID, to: GUID) {
        return new Cable(from, to);
    }
}