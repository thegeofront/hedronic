// export class Vector {
//     constructor(
//         public readonly x: number, 
//         public readonly y: number) {
//     }
//     static new(x: number, y: number) {
//         return new Vector(x, y);
//     }
//     static distance(a: Vector, b: Vector) {
//         return Math.pow((a.x - b.x) * 2 + (a.y - b.y) * 2, 0.5);
//     }
// }
// export class Line {
//     constructor(
//         public readonly a: Vector, 
//         public readonly b: Vector) {
//     }
//     static new(a: Vector, b: Vector) {
//         return new Line(a, b);
//     }
//     static getLength(line: Line) {
//         return Vector.distance(line.a, line.b);
//     }
// }
function somethingPrivate() {
    return "kaas";
}
export function getAnswer() {
    return 42;
}
export function someFunction(a, b) {
    return "this is a: ".concat(a, ", this is b ").concat(b);
}
export function getList(a) {
    var list = [a, a + 1, a + 2, a + 3];
    return list;
}
export function getTwoResults(a) {
    if (a) {
        return [a, a + 1];
    } else {
        return [a, a - 1];
    }
}
