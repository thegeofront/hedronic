export function point(x: number, y: number, z: number) {
    return {x, y, z};
}

export function swap(x: number, y: number) : [number, number, string] {
    return [y, x, `${x + y}`];
}

export function distance(a: {x: number, y: number, z: number}, b: {x: number, y: number, z: number}) {
    let dx = (a.x - b.x);
    let dy = (a.y - b.y);
    let dz = (a.z - b.z);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
