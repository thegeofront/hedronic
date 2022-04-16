import { Vector } from "../vector-0/vector";

export class Line {
    
    constructor(
        public a: Vector,
        public b: Vector,
    ) {}

    static line(a=Vector.vector(), b=Vector.vector()) {
        return new Line(a, b);
    }
}