export class Vector {
    
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}

    static newVector(x=0.0, y=0.0, z=0.0) {
        return new Vector(x,y,z);
    }

    decompose() : [number, number, number] {
        return [this.x, this.y, this.z];
    }
}

export class Line {
    
    constructor(
        public a: Vector,
        public b: Vector,
    ) {}

    static newLine(a=Vector.newVector(), b=Vector.newVector()) {
        return new Line(a, b);
    }

    decompose() : [Vector, Vector] {
        return [this.a, this.b];
    }
}
