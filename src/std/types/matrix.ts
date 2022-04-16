export class U16Matrix {

    constructor(
        public readonly width: number,
        public readonly height: number,
        public data: Uint16Array
    ) {}

    static U16Matrix(width=3, height=3, setter?: Uint16Array) {
        let data = new Uint16Array(width * height);
        if (setter) data.set(setter);
        return new U16Matrix(width, height, data);
    }
}

export class F32Matrix {

    constructor(
        public readonly width: number,
        public readonly height: number,
        public data: Float32Array
    ) {}

    static F32Matrix(width=3, height=3, setter?: Float32Array) {
        let data = new Float32Array(width * height);
        if (setter) data.set(setter);
        return new F32Matrix(width, height, data);
    }
}

export class Mesh {

    constructor(
        public points: F32Matrix,
        public links: U16Matrix,
    ) {}

}