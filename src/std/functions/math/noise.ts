import { Perlin } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";

const perlin = Perlin.new();

export const PerlinFunctions = [
    new FunctionShim("perlin", [""], noise, [TypeShim.new("x", Type.number), TypeShim.new("y", Type.number), TypeShim.new("z", Type.number)] , [TypeShim.new("n", Type.number)]),
]; 

function noise(x: number, y: number, z: number) : number {
    return perlin.noise(x, y, z);
}

