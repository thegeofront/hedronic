import { Vector } from "../v0/vector";

export class Line {
    
    constructor(
        public a: Vector,
        public b: Vector,
    ) {}

    static line(a=Vector.new(), b=Vector.new()) {
        return new Line(a, b);
    }
}

// let line3 = TypeShim.new("line-3", Type.Object, undefined, [
//     TypeShim.new("a", Type.Reference, undefined, [vector3]),
//     TypeShim.new("b", Type.Reference, undefined, [vector3]),
// ]);