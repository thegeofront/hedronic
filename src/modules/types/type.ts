import { TypeShim } from "../shims/type-shim";

// export type BufferLike = Type.IntBuffer | Type.UntBuffer | Type.ByteBuffer | Type.FloatBuffer | Type.DoubleBuffer;

// export type MatrixLike = Type.IntMatrix | Type.UntMatrix | Type.ByteMatrix | Type.FloatMatrix | Type.DoubleMatrix;

// export type GeometryLike = Type.Vector3 | Type.MultiVector3 | Type.Line3 | Type.MultiLine3 | Type.Mesh;

// TODO split up Primitive Types and List, Object, Union types, from the point of view of the canvas
// Object types will get special treatment

// TODO in desperate need of an overhaul


/**
 * NOTE: Not Implemented: this is a sketch
 * Represents the internal geofront type we want to communicate to the end user.
 */
export enum GeoFrontType {
    Void,
    Boolean,
    String,
    Integer,
    Float,

    // Transform,
    Plane,
    Point,
    // Vector,
    // Line,
    // Ray,
    // PolyLine,
    // Mesh,

    // MultiBoolean,
    // MultiString,
    // MultiInteger,
    // MultiFloat,
    MultiPoint,
    // MultiVector,
}

/**
 * The basic 'javascript' types supported by geofront
 */
export enum JsType { 
    
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
    Blob,      // Vec<?>   // Unknown
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
        TypeShim.new("Uint8Array", JsType.U8Buffer),
        TypeShim.new("Int8Array", JsType.I8Buffer),
        TypeShim.new("Uint16Array", JsType.U16Buffer),
        TypeShim.new("Int16Array", JsType.I16Buffer),
        TypeShim.new("Uint32Array", JsType.U32Buffer),
        TypeShim.new("Int32Array", JsType.I32Buffer),
        TypeShim.new("Float32Array", JsType.F32Buffer),
        TypeShim.new("Float64Array", JsType.F64Buffer),
    ]
}

export function fromReflection(any: any) : TypeShim {

    let wildcard = TypeShim.new("", JsType.any);

    
    if (any instanceof Array) {
        let item = any.length > 0 ? fromReflection(any[0]) : wildcard;
        return TypeShim.new("", JsType.List, undefined, [item]);
    }

    if (any instanceof Object) {
        let item = any.length > 0 ? fromReflection(any[0]) : TypeShim.new("", JsType.any);
        return TypeShim.new("", JsType.Object, undefined, [item]);
    }

    return TypeShim.new("", reflect(any));
}

/**
 * Reflect the type of an 'any'
 */
export function reflect(any: any) {
    if (any instanceof Array)
        return JsType.List;
    if (any instanceof Object)
        return JsType.Object;
    if (any instanceof Float32Array)
        return JsType.F32Buffer;
    if (any instanceof Float64Array)
        return JsType.F64Buffer;
    if (typeof any === 'string') 
        return JsType.string;
    if (typeof any === 'number')
        return JsType.number;

    return JsType.any;
}