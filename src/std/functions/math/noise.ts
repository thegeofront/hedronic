import { Perlin } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";
import { Point } from "../v0/point";

const perlin = Perlin.new();

export class Noise {

    constructor(
        public offset: number, 
        public frequency: number, 
        public amplitude: number, 
        public octaves: number, 
        public octaveBlend: number
    ) {}

    static new(offset: number, frequency: number, amp: number, octaves: number, blend: number) {
        return new Noise(offset, frequency, amp, octaves, blend);
    }

    static simple(point: Point) : number {
        return perlin.noise(point.x, point.y, point.z);
    }

    static octave(noise: Noise, point: Point) : number {
        return perlin.octaveNoise(
            point.x, point.y, point.z, noise.offset, noise.frequency, noise.amplitude, noise.octaves, noise.octaveBlend);
    }

    static readonly Functions = [
        new FunctionShim("noise", [], Noise.new, 
        [TypeShim.new("offset", JsType.number), TypeShim.new("freq", JsType.number), TypeShim.new("amp", JsType.number), TypeShim.new("octave", JsType.number), TypeShim.new("blend", JsType.number)] , 
        [TypeShim.new("n", JsType.number)]),
        new FunctionShim("perlin", [], Noise.simple, 
        [TypeShim.new("point", JsType.Object)] , 
        [TypeShim.new("n", JsType.number)]),
        new FunctionShim("octave", [], Noise.octave, 
        [TypeShim.new("noise", JsType.Object), TypeShim.new("point", JsType.Object)], 
        [TypeShim.new("n", JsType.number)]),
    ]; 
}





