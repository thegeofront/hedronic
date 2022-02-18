"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.someFunction = exports.getAnswer = exports.Line = exports.Vector = void 0;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.new = function (x, y) {
        return new Vector(x, y);
    };
    Vector.distance = function (a, b) {
        return Math.pow(a.x * a.x + b.x * b.y, 0.5);
    };
    return Vector;
}());
exports.Vector = Vector;
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
exports.Line = Line;
function getAnswer() {
    return 42;
}
exports.getAnswer = getAnswer;
function someFunction(a, b) {
    return "this is a: ".concat(a, ", this is b ").concat(b);
}
exports.someFunction = someFunction;
