/**
 * A collection of types used internally by the geofront environment
 * 
 * Q: This seems weird, why is it needed?
 * A: Certain javascript objects will get additional geofront support (like visualization). 
 *    We must recognise and label these special objects during import.    
 */

import { TypeShim } from "../shims/type-shim";
import { Type } from "./type";

export function getStandardTypesAsDict(suffix="") : Map<string, TypeShim> {
    let types = new Map<string, TypeShim>();

    for (let type of getBufferTypes()) {
        types.set(type.name, type);
    }

    for (let type of getObjectFlags()) {
        types.set(suffix + type.name, type);
    }

    return types;
}

export function getBufferTypes() {
    return [
        TypeShim.new("Uint8Array", Type.U8Buffer),
        TypeShim.new("Int8Array", Type.I8Buffer),
        TypeShim.new("Uint16Array", Type.U16Buffer),
        TypeShim.new("Int16Array", Type.I16Buffer),
        TypeShim.new("Uint32Array", Type.U32Buffer),
        TypeShim.new("Int32Array", Type.I32Buffer),
        TypeShim.new("Float32Array", Type.F32Buffer),
        TypeShim.new("Float64Array", Type.F64Buffer),
    ]
}



export function getObjectFlags(suffix="") {

    // Point3,
    // MultiPoint3,
    // Line3,
    // MultiLine3,
    // Mesh 

    let vector = TypeShim.new(suffix + "Vector3", Type.Object, undefined, [
        TypeShim.new("x", Type.number),
        TypeShim.new("y", Type.number),
        TypeShim.new("z", Type.number)
    ]);

    let multiVector = TypeShim.new(suffix + "MultiVector3", Type.Object, undefined, [
        TypeShim.new("data", Type.F64Buffer),
    ]);

    let line = TypeShim.new(suffix + "Line3", Type.Object, undefined, [
        TypeShim.new("a", Type.Reference, undefined, [vector]),
        TypeShim.new("b", Type.Reference, undefined, [vector]),
    ]);

    let multiLine = TypeShim.new(suffix + "MultiLine3", Type.Object, undefined, [
        TypeShim.new("a", Type.Reference, undefined, [vector]),
        TypeShim.new("b", Type.Reference, undefined, [vector]),
    ]);

    let mesh = TypeShim.new(suffix + "Mesh", Type.Object, undefined, [
        TypeShim.new("points", Type.F64Buffer),
        TypeShim.new("triangles", Type.U16Buffer),
    ]);

    return [vector, multiVector, line, multiLine, mesh];
}

const stdTypes = [
    // TypeShim.new("Promise", Type.number),


    TypeShim.new("Vector", Type.Object, undefined, [
        TypeShim.new("x", Type.number),
        TypeShim.new("y", Type.number),
        TypeShim.new("z", Type.number)
    ]),
]