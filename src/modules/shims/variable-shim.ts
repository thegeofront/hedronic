// import { TypeKind } from "./type-kind";

import { State } from "../../nodes-canvas/model/state";

/**
 * This is what the Flow would like to know about a certain variable
 * NOTE that this is NOT a StateShim
 * 
 * Example: `new VariableShim("radius", Type.number, "🔘");`
 * Example: `new VariableShim("point", Type.Ojbect, [
 *      new VariableShim("x", Type.number),
 *      new VariableShim("y", Type.number),
 *      new VariableShim("z", Type.number)
 * ]);`
 */
export class VariableShim {
    constructor(
        public name:  string,  // what to show up as name 
        public type: Type, // the actual type  
        public glyph?: string,  // how to visualize the type or variable briefly
        public child?: VariableShim[], // sub-variables (and with it, sub types). a list will have a item sub-variable for example
    ) {}

    static new(name: string, type: Type, glyph?: string, child?: VariableShim[]) {
        return new VariableShim(name, type, glyph, child);
    }

    /**
     * answers the question, can a state of `this` be put into `other` without problems?
     */
    isSameType(other: VariableShim) : boolean {

        // Any is difficult, it could potentially lead to unsafe circumstances. 
        // however, if the 'other' is any, we can accept everything 
        if (other.type == Type.any) return true;
        if (this.type != other.type) return false;

        // types with nested types will require additional checks
        // we only care if the actual types match. 
        // They do not have to have the same name 
        // we stick to the JS notion of : 'if it acts like X, it is X'
        if (this.type == Type.Tuple || this.type == Type.List || this.type == Type.Object) {   
            let childs = this.child!;
            let others = other.child!;
            if (this.child! || other.child!) throw new Error("should have children!");
            if (childs.length != others.length) throw new Error("should have same length!");
            for (let i = 0; i < this.child!.length; i++) {
                if (!childs[i].isSameType(others[i])) {
                    return false;
                }
            }  
        }
        return true;
    }

    typeToString() : string {
        switch (this.type) {
            case Type.any:
            case Type.boolean:
            case Type.number:
            case Type.string:
                return Type[this.type];
            
            case Type.Tuple:
                return `Tuple<${this.child!.map(c => c.typeToString()).join(", ")}>`;
            case Type.List:
                return `List<${this.child![0].typeToString()}>`;
            case Type.Object:
                return `Object<${this.child!.map(c => `${c.name}: ${c.typeToString()}`).join(", ")}>`;  
        }
    }

    render() : string {

        if (this.glyph) return this.glyph;   

        switch (this.type) {
            case Type.any:
            case Type.boolean:
            case Type.number:
            case Type.string:
                return this.name.charAt(0).toUpperCase();
            
            case Type.Tuple:
            case Type.List:
                return `[ ${this.child!.map(c => c.render()).join(" , ")} ]`;
            case Type.Object:
                return `{}`;
        }
    }
}

// https://www.sheshbabu.com/posts/rust-for-javascript-developers-pattern-matching-and-enums/
// *sigh*, if only we could write something like this. 
// ```
// enum TypeKind {
//     Any,
//     Boolean,
//     Number,
//     String,
//     List(TypeKind),
//     Tuple(TypeKind[]),
// }
// ``` 
// thats really all we need. Now, we need to do weird things with children
export enum Type {
    any,
    boolean,
    number,
    string,
    List,
    Tuple,
    Object,
}

export enum SameTypeResult {
    Same,
    Different,
    Unsure,
}