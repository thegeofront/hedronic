// let multiVector3 = TypeShim.new("multi-vector-3", Type.Object, undefined, [
//     TypeShim.new("buffer", Type.F32Buffer),
// ]);


export interface MultiVector2 {
    trait: "multi-vector-2",
    data: Array<number>,
}