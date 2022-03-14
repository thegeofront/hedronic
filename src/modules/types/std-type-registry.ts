/**
 * A collection of types used internally by the geofront environment
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
    let myUint8Array   = TypeShim.new("Uint8Array", Type.Array, undefined, [TypeShim.new("uint8", Type.number)]);
    let myInt8Array    = TypeShim.new("Int8Array", Type.Array, undefined, [TypeShim.new("int8", Type.number)]);
    let myUint16Array  = TypeShim.new("Uint16Array", Type.Array, undefined, [TypeShim.new("uint16", Type.number)]);
    let myInt16Array   = TypeShim.new("Int16Array", Type.Array, undefined, [TypeShim.new("int16", Type.number)]);
    let myUint32Array  = TypeShim.new("Uint32Array", Type.Array, undefined, [TypeShim.new("uint32", Type.number)]);
    let myInt32Array   = TypeShim.new("Int32Array", Type.Array, undefined, [TypeShim.new("int32", Type.number)]);
    let myFloat32Array = TypeShim.new("Float32Array", Type.Array, undefined, [TypeShim.new("float32", Type.number)]);
    let myFloat64Array = TypeShim.new("Float64Array", Type.Array, undefined, [TypeShim.new("float32", Type.number)]);

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

    let vector = TypeShim.new(suffix + "Vector", Type.Object, undefined, [
        TypeShim.new("x", Type.number),
        TypeShim.new("y", Type.number),
        TypeShim.new("z", Type.number)
    ]);

    let line = TypeShim.new(suffix + "Line", Type.Object, undefined, [
        TypeShim.new("a", Type.Reference, undefined, [vector]),
        TypeShim.new("b", Type.Reference, undefined, [vector]),
    ]);

    let multiVector = TypeShim.new(suffix + "MultiVector", Type.Object, undefined, [
        TypeShim.new("a", Type.Reference, undefined, [vector]),
        TypeShim.new("b", Type.Reference, undefined, [vector]),
    ]);

    return [vector, multiVector, line];
}

const stdTypes = [
    // TypeShim.new("Promise", Type.number),


    TypeShim.new("Vector", Type.Object, undefined, [
        TypeShim.new("x", Type.number),
        TypeShim.new("y", Type.number),
        TypeShim.new("z", Type.number)
    ]),
]