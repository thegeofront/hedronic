export class Point {
    
    constructor(
        public x: number,
        public y: number,
    ) {}

    static new(x=0.0, y=0.0) {
        return new Point(x,y);
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

export function anotherThingie(x: number) : Point {
    return new Point(x, 3);
}

export function addThingies(a: Point, b: Point) : Point {
    return new Point(a.x + b.x, a.y + b.y);
}