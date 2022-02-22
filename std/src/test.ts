// class Thingie {
    
//     constructor(
//         public x: number,
//         public y: number,
//     ) {}

// }

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

// export function getThingie(x: number) : Kaas {
//     return new Thingie(x, 2);
// }

// export function anotherThingie(x: number) : Thingie {
//     return new Thingie(x, 3);
// }