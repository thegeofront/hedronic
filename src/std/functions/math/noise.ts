import { Perlin } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
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
        [TypeShim.new("offset", Type.number), TypeShim.new("freq", Type.number), TypeShim.new("amp", Type.number), TypeShim.new("octave", Type.number), TypeShim.new("blend", Type.number)] , 
        [TypeShim.new("n", Type.number)]),
        new FunctionShim("perlin", [], Noise.simple, 
        [TypeShim.new("point", Type.Object)] , 
        [TypeShim.new("n", Type.number)]),
        new FunctionShim("octave", [], Noise.octave, 
        [TypeShim.new("noise", Type.Object), TypeShim.new("point", Type.Object)], 
        [TypeShim.new("n", Type.number)]),
    ]; 
}





