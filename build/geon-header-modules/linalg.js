var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.new = function (x, y) {
        return new Vector(x, y);
    };
    Vector.distance = function (a, b) {
        return Math.pow((a.x - b.x) * 2 + (a.y - b.y) * 2, 0.5);
    };
    return Vector;
}());
export { Vector };
var Line = /** @class */ (function () {
    function Line(a, b) {
        this.a = a;
        this.b = b;
    }
    Line.new = function (a, b) {
        return new Line(a, b);
    };
    Line.getLength = function (line) {
        return Vector.distance(line.a, line.b);
    };
    return Line;
}());
export { Line };
export function getAnswer() {
    return 42;
}
export function someFunction(a, b) {
    return "this is a: ".concat(a, ", this is b ").concat(b);
}
