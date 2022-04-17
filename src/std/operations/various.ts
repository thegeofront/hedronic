import { Perlin } from "../../../../engine/src/lib";
import { FunctionShim } from "../../modules/shims/function-shim";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";

const perlin = Perlin.new();

export function getVariousFunctions(namespace="various") {

    return [
        FunctionShim.new("createRandomPointcloud", [namespace], randomPoints, [

        ], [

        ]),

        FunctionShim.new("randomPointcloud", [namespace], noise, [
            TypeShim.new("x", Type.number), 
            TypeShim.new("y", Type.number), 
            TypeShim.new("z", Type.number)
        ] , [
            TypeShim.new("n", Type.number)
        ]),
    ]; 
}

function randomPoints(rng: any, domain: [number, number, number], count: number) {

}

function noise(x: number, y: number, z: number) : number {
    return perlin.noise(x, y, z);
}


export async function fetchJson(path: string) {
    let data = await fetch(path);
    return await data.json();
}

export async function fetchText(path: string) {
    let data = await fetch(path);
    return await data.text();
}

export function asNumber(n: any) : number {
    return Number(n);
}

export function asBoolean(n: any) : boolean {
    return Boolean(n);
}

export function asString(n: any): string {
    return String(n);
}



export function asList(any: any): any[] {
    return any as Array<any>;
}

