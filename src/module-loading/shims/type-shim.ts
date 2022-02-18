/**
 * 
 */
export class TypeShim {
    constructor(
        public name:  string,
        public glyph: string,
        public uid: string,
        public origin: string, // std, or the id of the library
    ) {}

    static any() {
        return new TypeShim("", "", "", "");
    }

    equals(other: TypeShim) {
        return this.uid == other.uid;
    }
}
