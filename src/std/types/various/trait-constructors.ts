/**
 * This will make sure we can export and import more complex types from and to something like rust
 */
export function newVector3(x: number, y: number, z: number) {
    return {
        x, y, z
    }
}

export function newMultiVector3(data: Float32Array | Float64Array) {
    return {
        vertices: Float64Array.from(data),
    };
}

export function newLine3(ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
    return {
        a: {x: ax, y: ay, z: az},
        b: {x: bx, y: by, z: bz},
    }
}

export function newMultiLine3(data: Float32Array | Float64Array, lines: Uint16Array) {
    return {
        vertices: Float64Array.from(data),
        lines: Uint16Array.from(lines)
    };
}

export function newMesh(vertices: Float32Array | Float64Array, triangles: Uint16Array | Uint32Array ) {
    return {
        vertices: Float64Array.from(vertices), 
        triangles: Uint16Array.from(triangles),
    };
}