export declare class Vector {
    readonly x: number;
    readonly y: number;
    constructor(x: number, y: number);
    static new(x: number, y: number): Vector;
    static distance(a: Vector, b: Vector): number;
}
export declare class Line {
    readonly a: Vector;
    readonly b: Vector;
    constructor(a: Vector, b: Vector);
    static new(a: Vector, b: Vector): Line;
    static getLength(line: Line): number;
}
export declare function getAnswer(): number;
export declare function someFunction(a: string, b: number): string;
