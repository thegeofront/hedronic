// import { TypeKind } from "./type-kind";

import { TypeKind } from "./type-kind";

/**
 * This is what the Flow would like to know about a certain Type
 */
export class TypeShim {
    constructor(
        public kind: TypeKind,
        public name:  string,
        public glyph: string,
        public child?: TypeShim[],
    ) {}

    static new(kind: TypeKind, name: string, glyph: string, child?: TypeShim[]) {
        return new TypeShim(kind, name, glyph, child);
    }

    equals(other: TypeShim) {
        return this.kind == other.kind;
    }

    toString() : string {
        switch (this.kind) {
            case TypeKind.Any:
            case TypeKind.Boolean:
            case TypeKind.Number:
            case TypeKind.String:
                return this.name;
            
            case TypeKind.Tuple:
                return `tuple<${this.child!.map(c => c.toString()).join(", ")}>`;
            case TypeKind.List:
                return `list<${this.child![0].toString()}>`;
            default:
                return "(ERR)";  
        }
    }

    render() : string {
        switch (this.kind) {
            case TypeKind.Any:
            case TypeKind.Boolean:
            case TypeKind.Number:
            case TypeKind.String:
                return this.glyph;
            
            case TypeKind.Tuple:
            case TypeKind.List:
                return `[ ${this.child!.map(c => c.render()).join(" , ")} ]`;
            default:
                return "(ERR)";  
        }
    }
}

export function getBasicTypes() {
    return [
        TypeShim.new(TypeKind.Any, "any", "A"),
        TypeShim.new(TypeKind.Boolean, "boolean", "B"),
        TypeShim.new(TypeKind.Number, "number", "N"),
        TypeShim.new(TypeKind.String, "string", "S"),
    ];
}