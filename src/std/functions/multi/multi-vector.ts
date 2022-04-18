// let multiVector3 = TypeShim.new("multi-vector-3", Type.Object, undefined, [
//     TypeShim.new("buffer", Type.F32Buffer),
// ]);

import { Vector } from "../v0/vector";

export interface MultiVector2 {
    data: Float32Array,
}

export interface MultiVector3 {
    data: Float32Array,
}

export function aggregate(vectorList: Vector[]) : MultiVector3 {
    let data = new Float32Array(vectorList.length * 3);
    for (let [i, vector] of vectorList.entries()) {
        data[i*3 + 0] = vector.x;
        data[i*3 + 1] = vector.y;
        data[i*3 + 2] = vector.z;
    }
    return {data: data}
}


export function iterate(multiVector: MultiVector3) {
    const { data } = multiVector;
    let list: Vector[] = [];
    let height = data.length / 3;
    for (let i = 0 ; i < height ; i++) {
        list.push({
            x: data[i*3 + 0],
            y: data[i*3 + 1],
            z: data[i*3 + 2]
        });
    }
    return list;
}