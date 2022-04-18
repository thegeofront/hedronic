import { Perlin } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { Point } from "../v0/point";

const perlin = Perlin.new();

export class Noise {

    constructor(
        public offset?: number, 
        public frequency?: number, 
        public amplitude?: number, 
        public octaves?: number, 
        public octaveBlend?: number
    ) {}

    static new() {

    }

    static simple(point: Point) : number {
        return perlin.noise(point.x, point.y, point.z);
    }

    static octave(point: Point) : number {
        return perlin.octaveNoise(
            point.x, point.y, point.z,);
    }

    static readonly Functions = [
        new FunctionShim("perlin", [""], Noise.get, [TypeShim.new("x", Type.number), TypeShim.new("y", Type.number), TypeShim.new("z", Type.number)] , [TypeShim.new("n", Type.number)]),
    ]; 
}





