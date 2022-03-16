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

    for (let type of getDataTypes()) {
        types.set(type.name, type);
    }

    // for (let type of stdTypes) {
    //     types.set(suffix + type.name, type);
    // }

    return types;
}

export function getDataTypes() {
    
    // all array types 
    let myUint8Array   = TypeShim.new("Uint8Array", Type.U8Buffer);
    let myInt8Array    = TypeShim.new("Int8Array", Type.I8Buffer);
    let myUint16Array  = TypeShim.new("Uint16Array", Type.U16Buffer);
    let myInt16Array   = TypeShim.new("Int16Array", Type.I16Buffer);
    let myUint32Array  = TypeShim.new("Uint32Array", Type.U32Buffer);
    let myInt32Array   = TypeShim.new("Int32Array", Type.I32Buffer);
    let myFloat32Array = TypeShim.new("Float32Array", Type.F32Buffer);
    let myFloat64Array = TypeShim.new("Float64Array", Type.F64Buffer);

    return [
        myUint8Array,
        myInt8Array,
        myUint16Array,
        myInt16Array,
        myUint32Array,
        myInt32Array,
        myFloat32Array,
        myFloat64Array,
    ]
}



export function getStandardTypes(suffix="") {

    // Point3,
    // MultiPoint3,
    // Line3,
    // MultiLine3,
    // Mesh 

    let vector = TypeShim.new(suffix + "Vector3", Type.Vector3, undefined, [
        TypeShim.new("x", Type.number),
        TypeShim.new("y", Type.number),
        TypeShim.new("z", Type.number)
    ]);

    let multiVector = TypeShim.new(suffix + "MultiVector3", Type.MultiVector3, undefined, [
        TypeShim.new("data", Type.F64Buffer),
    ]);

    let line = TypeShim.new(suffix + "Line3", Type.Line3, undefined, [
        TypeShim.new("a", Type.Reference, undefined, [vector]),
        TypeShim.new("b", Type.Reference, undefined, [vector]),
    ]);

    let multiLine = TypeShim.new(suffix + "MultiLine3", Type.Line3, undefined, [
        TypeShim.new("a", Type.Reference, undefined, [vector]),
        TypeShim.new("b", Type.Reference, undefined, [vector]),
    ]);

    let mesh = TypeShim.new(suffix + "Mesh", Type.Line3, undefined, [
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