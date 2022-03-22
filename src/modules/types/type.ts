import { TypeShim } from "../shims/type-shim";

// export type BufferLike = Type.IntBuffer | Type.UntBuffer | Type.ByteBuffer | Type.FloatBuffer | Type.DoubleBuffer;

// export type MatrixLike = Type.IntMatrix | Type.UntMatrix | Type.ByteMatrix | Type.FloatMatrix | Type.DoubleMatrix;

// export type GeometryLike = Type.Vector3 | Type.MultiVector3 | Type.Line3 | Type.MultiLine3 | Type.Mesh;


/**
 * The basic 'javascript' types supported by geofront
 */
export enum Type {
    
    // basics
    void,
    any,
    boolean,
    number,
    string,

    // collections 
    List,
    Tuple,
    Object,

    // weirds
    Union,
    Reference, // this is how foreign types / objects are represented
    Promise,
    Literal,

    // buffers 
    U8Buffer,  // Vec<u8>  // Byte
    I8Buffer,  // Vec<u8>  // (leave out)
    U16Buffer, // Vec<u8>  // (leave out)
    I16Buffer, // Vec<u8>  // (leave out)
    U32Buffer, // Vec<u32> // Unt
    I32Buffer, // Vec<i32> // int
    F32Buffer, // Vec<f32> // Float
    F64Buffer, // Vec<f64> // Double
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

export function fromReflection(any: any) : TypeShim {

    let wildcard = TypeShim.new("", Type.any);

    
    if (any instanceof Array) {
        let item = any.length > 0 ? fromReflection(any[0]) : wildcard;
        return TypeShim.new("", Type.List, undefined, [item]);
    }

    if (any instanceof Object) {
        let item = any.length > 0 ? fromReflection(any[0]) : TypeShim.new("", Type.any);
        return TypeShim.new("", Type.Object, undefined, [item]);
    }

    return TypeShim.new("", reflect(any));
}

/**
 * Reflect the type of an 'any'
 */
export function reflect(any: any) {
    if (any instanceof Array)
        return Type.List;
    if (any instanceof Object)
        return Type.Object;
    if (any instanceof Float32Array)
        return Type.F32Buffer;
    if (any instanceof Float64Array)
        return Type.F64Buffer;
    if (typeof any === 'string') 
        return Type.string;
    if (typeof any === 'number')
        return Type.number;

    return Type.any;
}