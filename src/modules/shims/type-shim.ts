// import { TypeKind } from "./type-kind";

import { Trait, tryApplyTraits } from "../types/trait";
import { Type } from "../types/type";
import { TypeChecking } from "../types/type-checking";
import { TypeConvertion } from "../types/type-convertion";

/**
 * This is what Geofront would like to know about a certain variable's type
 */
export class TypeShim {

    traits: Trait[] = [];

    private constructor(
        public name:  string,  // what to show up as name 
        public type: Type, // the actual type  
        public readonly glyph?: string,  // how to visualize the type or variable briefly
        public readonly children?: TypeShim[], // sub-variables (and with it, sub types). a list will have a item sub-variable for example
    ) {}

    static new(name: string, type: Type, glyph?: string, child?: TypeShim[]) {

        // make sure children are sorted
        // this is dumb, but relevant for type checking
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

    deepcopy() : TypeShim {
        return new TypeShim(this.name, this.type, this.glyph, this.children?.map(child => child.deepcopy()));
    }

    /**
     * answers the question, can a state of `this` be put into `other` without problems?
     */
    isAcceptableType(other: TypeShim) : boolean {
        return TypeChecking.doTypesFit(this, other);
    }

    /**
     * Render a verbose string
     */
    typeToString() : string {
        switch (this.type) {
            case Type.Tuple:
                return `Tuple<${this.children?.map(c => c.typeToString()).join(", ")}>`;
            case Type.List:
            return `List<${this.children?.map(c => c.typeToString()).join(", ")}>`;
            case Type.Object:
                return `Object {${this.children?.map(c => `${c.name}: ${c.typeToString()}`).join(", ")}}`;  
            case Type.Union:
                return `${this.children?.map(c => `${c.typeToString()}`).join(" | ")}`;  
            case Type.Reference:
                return `Ref->${this.children?.[0].name}`;  
            case Type.Promise:
                return `Promise->${this.children![0].typeToString()}`; 
            default: 
                return Type[this.type];
        }
    }

    /**
     * Render the thing visible on the node
     */
    render() : string {

        if (this.glyph) return this.glyph;   
        
        if (this.name !== "") return this.name;

        switch (this.type) {
            case Type.void:
                return "-"
            case Type.any:
            case Type.boolean:
            case Type.number:
            case Type.string:
                return Type[this.type][0].toLocaleUpperCase();
            
            case Type.Tuple:
            case Type.List:
                return `[ ${this.children?.map(c => c.render()).join(" , ") || "any"} ]`;
            case Type.Object:
                return `{}`;
            case Type.Union:
                return `${this.children?.map(c => c.render()).join(" | ")}`;
            case Type.Reference:
                return this.children?.[0].render() || "any";  
            case Type.Promise:
                return `P->` + this.children?.[0].render() || "any";  
            case Type.U8Buffer:
            case Type.I8Buffer:
            case Type.U16Buffer:
            case Type.I16Buffer:
            case Type.U32Buffer:
            case Type.I32Buffer:
            case Type.F32Buffer:
            case Type.F64Buffer:
                return Type[this.type].slice(0, 3);
            default:
                return "";
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
