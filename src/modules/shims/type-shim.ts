// import { TypeKind } from "./type-kind";

import { State } from "../../nodes-canvas/model/state";
import { Type } from "../types/type";

/**
 * This is what the Flow would like to know about a certain variable
 * NOTE that this is NOT a StateShim
 * 
 * NOTE: maybe a better name would be 'NamedType'
 * 
 * Example: `new VariableShim("radius", Type.number, "🔘");`
 * Example: `new VariableShim("point", Type.Ojbect, [
 *      new VariableShim("x", Type.number),
 *      new VariableShim("y", Type.number),
 *      new VariableShim("z", Type.number)
 * ]);`
 */
export class TypeShim {
    private constructor(
        public readonly name:  string,  // what to show up as name 
        public readonly type: Type, // the actual type  
        public readonly glyph?: string,  // how to visualize the type or variable briefly
        public readonly child?: TypeShim[], // sub-variables (and with it, sub types). a list will have a item sub-variable for example
    ) {}

    static new(name: string, type: Type, glyph?: string, child?: TypeShim[]) {

        // make sure children are sorted
        if (child) {
            child.sort((a, b) => {
                if (a.name == b.name) {
                    throw new Error("children must have unique names...");
                }
                if (a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }
            })
        }

        return new TypeShim(name, type, glyph, child);
    }

    /**
     * answers the question, can a state of `this` be put into `other` without problems?
     */
    isAcceptableType(other: TypeShim) : boolean {

        // console.log("this", this.typeToString(), "other", other.typeToString())

        // Any is difficult, it could potentially lead to unsafe circumstances. 
        // however, if the 'other' is any, we can accept everything 
        if (other.type == Type.any) return true;

        if (other.type == Type.Reference) {
            return this.isAcceptableType(other.child![0]);
        }
        if (this.type == Type.Reference) {
            return this.child![0].isAcceptableType(other);
        }

        // deal with union types
        if (other.type == Type.Union) {
            if (!other.child) throw new Error("should have children!");
            let others = other.child!;
            for (let oChild of others) {
                if (this.isAcceptableType(oChild)) {
                    return true;
                }
            }
            return false;
        }
        if (this.type == Type.Union) {
            if (!this.child) throw new Error("should have children!");
            let children = this.child!;
            for (let child of children) {
                if (child.isAcceptableType(other)) {
                    return true;
                }
            }
            return false;
        }

        // after that, do not accept different base types anymore
        if (other.type != this.type) return false;

        // types with nested types will require additional checks
        // we only care if the actual types match. 
        // They do not have to have the same name 
        // we stick to the JS notion of : 'if it acts like X, it is X'
        if (other.type == Type.Tuple || other.type == Type.List || other.type == Type.Object) {   
            let childs = this.child!;
            let others = other.child!;
            if (!childs || !others) throw new Error("should have children!");
            if (childs.length != others.length) throw new Error("should have same length!");
            for (let i = 0; i < this.child!.length; i++) {
                if (childs[i].name != others[i].name || !childs[i].isAcceptableType(others[i])) {
                    return false;
                }
            }  
        }

        return true;
    }

    typeToString() : string {
        switch (this.type) {
            case Type.void:
                return "void";
            case Type.any:
                return "any";
            case Type.boolean:
                return "bool";
            case Type.number:
                return "num";
            case Type.string:
                return "str";
            case Type.Tuple:
                return `Tuple<${this.child!.map(c => c.typeToString()).join(", ")}>`;
            case Type.Array:
                return `Array<${this.child![0].typeToString()}>`;
            case Type.List:
            return `List<${this.child![0].typeToString()}>`;
            case Type.Object:
                return `Object {${this.child!.map(c => `${c.name}: ${c.typeToString()}`).join(", ")}}`;  
            case Type.Union:
                return `${this.child!.map(c => `${c.typeToString()}`).join(" | ")}`;  
            case Type.Reference:
                return `${this.child![0].name}`;  
            case Type.Promise:
                return `Promise->${this.child![0].typeToString()}`; 
        }
    }

    render() : string {

        if (this.glyph) return this.glyph;   

        switch (this.type) {
            case Type.void:
                return "-"
            case Type.any:
            case Type.boolean:
            case Type.number:
            case Type.string:
                return this.name.charAt(0).toUpperCase();
            
            case Type.Array:
            case Type.Tuple:
            case Type.List:
                return `[ ${this.child!.map(c => c.render()).join(" , ")} ]`;
            case Type.Object:
                return `{}`;
            case Type.Union:
                return `[ ${this.child!.map(c => c.render()).join(" | ")} ]`;
            case Type.Reference:
                return this.child![0].render();  
            case Type.Promise:
                return `P->` + this.child![0].render();  
        } 
    }
}
