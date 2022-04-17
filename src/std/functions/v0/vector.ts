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

// let vector3 = TypeShim.new("vector-3", Type.Object, undefined, [
//     TypeShim.new("x", Type.number),
//     TypeShim.new("y", Type.number),
//     TypeShim.new("z", Type.number)
// ]);

