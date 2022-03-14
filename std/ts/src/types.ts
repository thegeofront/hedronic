export class Vector {
    
    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}

    static vector(x=0.0, y=0.0, z=0.0) {
        return new Vector(x,y,z);
    }
}

export class Line {
    
    constructor(
        public a: Vector,
        public b: Vector,
    ) {}

    static line(a=Vector.vector(), b=Vector.vector()) {
        return new Line(a, b);
    }
}