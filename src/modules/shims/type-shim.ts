// import { TypeKind } from "./type-kind";


import { GFTypes } from "../../std/geofront-types";
import { JsType } from "../types/type";
import { TypeChecking } from "../types/type-checking";
import { TypeConvertion } from "../types/type-convertion";

/**
 * This is what Geofront would like to know about a certain variable's type
 * NOTE: This is starting to become very messy...
 */
export class TypeShim {

    traits: GFTypes[] = [];

    private constructor(
        public name:  string, // what to show as name 
        public type: JsType, // the actual type  
        public readonly glyph?: string,  // how to visualize the type or variable in shortened form
        public readonly children?: TypeShim[], // sub-variables (and with it, sub types). a list will have a item sub-variable for example
    ) {}

    static new(name: string, type: JsType, glyph?: string, child?: TypeShim[]) {

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
            case JsType.Tuple:
                return `Tuple<${this.children?.map(c => c.typeToString()).join(", ")}>`;
            case JsType.List:
            return `List<${this.children?.map(c => c.typeToString()).join(", ")}>`;
            case JsType.Object:
                return `Object {${this.children?.map(c => `${c.name}: ${c.typeToString()}`).join(", ")}}`;  
            case JsType.Union:
                return `${this.children?.map(c => `${c.typeToString()}`).join(" | ")}`;  
            case JsType.Reference:
                return `Ref->${this.children?.[0].name}`;  
            case JsType.Promise:
                return `Promise->${this.children![0].typeToString()}`; 
            default: 
                return JsType[this.type];
        }
    }

    /**
     * Render the thing visible on the node
     * Make sure its never too big
     */
    render() : string {

        if (this.glyph) return this.glyph;   
        
        if (this.name !== "") return this.name.slice(0, 5);

        switch (this.type) {
            case JsType.void:
                return "-"
            case JsType.any:
            case JsType.boolean:
            case JsType.number:
            case JsType.string:
                return JsType[this.type][0].toLocaleUpperCase();
            
            case JsType.Tuple:
            case JsType.List:
                return `[ ${this.children?.map(c => c.render()).join(" , ") || "any"} ]`;
            case JsType.Object:
                return `{}`;
            case JsType.Union:
                return `${this.children?.map(c => c.render()).join(" | ")}`;
            case JsType.Reference:
                return this.children?.[0].render() || "any";  
            case JsType.Promise:
                return `P->` + this.children?.[0].render() || "any";  
            case JsType.U8Buffer:
            case JsType.I8Buffer:
            case JsType.U16Buffer:
            case JsType.I16Buffer:
            case JsType.U32Buffer:
            case JsType.I32Buffer:
            case JsType.F32Buffer:
            case JsType.F64Buffer:
                return JsType[this.type].slice(0, 3);
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
