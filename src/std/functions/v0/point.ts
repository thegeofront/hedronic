import { FunctionShim } from "../../../modules/shims/function-shim";
import { JsType } from "../../../modules/types/type";
import { MapTree } from "../../../util/maptree";
import { Divider, shim, divider } from "../../std-system";

export class Point {

    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}
    
    static new(x = 0.0, y = 0.0, z = 0.0) {
        return new Point(x, y, z);
    }

    static fromArray(array: number[]) {
        return new Point(array[0], array[1], array[2]);
    }

    static readonly Functions = [
        shim(Point.new, "Point", "A 3D point in space", 
            [JsType.number, JsType.number, JsType.number], 
            [JsType.Object]),
        shim(Point.fromArray, "Point from array", "Create a point from the first 3 items of this list",
            [JsType.List], 
            [JsType.Object]),
        divider(),
    ]; 

}