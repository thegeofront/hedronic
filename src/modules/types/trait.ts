/**
 * Inspired by rust's way of doing things 
 * 
 * All `Type.Object parameters can recieve one or more of these Traits
 * This means that the object *as* this trait, or can be used *as if* it were like this trait. 
 * 
 */

import { TypeShim } from "../shims/type-shim";
import { Type } from "./type";

export enum Trait {
    Vector3, 
    MultiVector3,
    Line3,
    MultiLine3,
    Mesh,
}

export const TraitShims = getTraitShims();

export function getTraitShims(suffix="") {

    let traitShims = new Map<Trait, TypeShim>();

    let vector3 = TypeShim.new("vector-3", Type.Object, undefined, [
        TypeShim.new("x", Type.number),
        TypeShim.new("y", Type.number),
        TypeShim.new("z", Type.number)
    ]);

    let multiVector3 = TypeShim.new("multi-vector-3", Type.Object, undefined, [
        TypeShim.new("trait", Type.Literal, undefined, [TypeShim.new("multi-vector-3", Type.string)]),
        TypeShim.new("buffer", Type.F32Buffer),
    ]);
    
    let line3 = TypeShim.new("line-3", Type.Object, undefined, [
        TypeShim.new("a", Type.Reference, undefined, [vector3]),
        TypeShim.new("b", Type.Reference, undefined, [vector3]),
    ]);
    
    let multiLine3 = TypeShim.new("multi-line-3", Type.Object, undefined, [
        TypeShim.new("trait", Type.Literal, undefined, [TypeShim.new("multi-line-3", Type.string)]),
        TypeShim.new("vertices", Type.F32Buffer),
        TypeShim.new("edges", Type.U16Buffer),
    ]);
    
    let mesh = TypeShim.new("mesh", Type.Object, undefined, [
        TypeShim.new("trait", Type.Literal, undefined, [TypeShim.new("mesh", Type.string)]),
        TypeShim.new("vertices", Type.F32Buffer),
        TypeShim.new("triangles", Type.U16Buffer),
    ]);

    traitShims.set(Trait.Line3, line3);
    traitShims.set(Trait.Vector3, vector3);
    traitShims.set(Trait.MultiLine3, multiLine3);
    traitShims.set(Trait.MultiVector3, multiVector3);
    traitShims.set(Trait.Mesh, mesh);

    return traitShims
}


/**
 * if this typeshim deserves traits, give them
 */
export function tryApplyTraits(type: TypeShim, traitShims=TraitShims) {

    for (let [trait, shim] of traitShims.entries()) {
        if (type.isAcceptableType(shim)) {
            // console.log(type, "is acceptable to ", Trait[trait]);
            type.traits.push(trait);
        } 
        
        // else if (shim.isAcceptableType(type)) {
        //     console.log(type, "is reverse acceptable to ", Trait[trait]);
        //     type.traits.push(trait);
        // }
    }

    return type;
}
