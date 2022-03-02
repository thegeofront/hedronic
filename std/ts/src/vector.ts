export class Vector {
    
    constructor(
        public x: number,
        public y: number,
    ) {}

    static new(x=0.0, y=0.0) {
        return new Vector(x,y);
    }

    decompose() : [number, number] {
        return [this.x, this.y];
    }
}

/**
 * A thing to do things
 */
interface Thing {
    name: string,
    value: number,
}

export type Kaas = Thing;

export function getThing(value: number) {
    let name = "hallo";
    let a: Thing = {name, value};
    return a;
}

export function getThingie(x: number) : Kaas {
    return {name: "henk", value: x};
}

export function anotherThingie(x: number) : Vector {
    return new Vector(x, 3);
}

export function addThingies(a: Vector, b: Vector) : Vector {
    return new Vector(a.x + b.x, a.y + b.y);
}