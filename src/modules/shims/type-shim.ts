// import { TypeKind } from "./type-kind";

import { isTypeElement } from "typescript";
import { State } from "../../nodes-canvas/model/state";
import { Trait } from "../types/trait";
import { Type } from "../types/type";

/**
 * This is what Geofront would like to know about a certain variable's type
 */
export class TypeShim {

    traits: Trait[] = [];

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
                    console.error("children must have unique names...", a.name, b.name);
                    return 0;
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
            if (!childs || !others) return false;
            if (childs.length != others.length) return false;
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
            case Type.List:
            return `List<${this.child![0].typeToString()}>`;
            case Type.Object:
                return `Object {${this.child!.map(c => `${c.name}: ${c.typeToString()}`).join(", ")}}`;  
            case Type.Union:
                return `${this.child!.map(c => `${c.typeToString()}`).join(" | ")}`;  
            case Type.Reference:
                return `Ref->${this.child![0].name}`;  
            case Type.Promise:
                return `Promise->${this.child![0].typeToString()}`; 

            case Type.U8Buffer:
            case Type.I8Buffer:
            case Type.U16Buffer:
            case Type.I16Buffer:
            case Type.U32Buffer:
            case Type.I32Buffer:
            case Type.F32Buffer:
            case Type.F64Buffer:
                return `Buffer`;
            
            // case Type.ByteMatrix:
            // case Type.UntMatrix:
            // case Type.IntMatrix:
            // case Type.FloatMatrix:
            // case Type.DoubleMatrix:
            //     return `Matrix<${this.child![0].typeToString()}>`;

            // case Type.Vector3:
            //     return `Point3`
            // case Type.MultiVector3:
            //     return `MultiPoint3`
            // case Type.Line3:
            //     return `Line3`
            // case Type.MultiLine3:
            //     return `MultiLine3`
            // case Type.Mesh:
            //     return `Mesh`
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
            case Type.U8Buffer:
            case Type.I8Buffer:
            case Type.U16Buffer:
            case Type.I16Buffer:
            case Type.U32Buffer:
            case Type.I32Buffer:
            case Type.F32Buffer:
            case Type.F64Buffer:
                return Type[this.type].slice(0, 3);
            
            // case Type.ByteMatrix:
            // case Type.UntMatrix:
            // case Type.IntMatrix:
            // case Type.FloatMatrix:
            // case Type.DoubleMatrix:
            //     return `Matrix<${this.child![0].typeToString()}>`;

            // case Type.Vector3:
            //     return `Point3`
            // case Type.MultiVector3:
            //     return `MultiPoint3`
            // case Type.Line3:
            //     return `Line3`
            // case Type.MultiLine3:
            //     return `MultiLine3`
            // case Type.Mesh:
            //     return `Mesh`
        } 
    }
}
