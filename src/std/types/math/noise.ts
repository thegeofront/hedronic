import { Perlin } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { GFType } from "../gftype";

const perlin = Perlin.new();

export class Noise implements GFType {
    
    private constructor(
        public offset = 1, 
        public frequency = 1, 
        public amplitude = 1, 
        public octaves = 1, 
        public octaveBlend = 0.5
    ) {}

    getFunctionShims(): FunctionShim[] {
        return []
    }
    fromJson(json: any) {
        
    }

    static new() {

    }

    static get(noise: Noise) {

    }

    static getOctaved(noise: Noise, ) {
        // perlin.octaveNoise()
    }

}