export class Point {

    static new(x, y) {
        let p = new Point();
        p.x = x;
        p.y = y;
        return p;
    }
}

export function depoint(p=Point.new()) {
    return [p.x,p.y];
}

// export function Point(x, y, z) {
//     let res = {x,y,z};
//     return [res];
// }

export function add(a, b) {
    let res = {
        x: a.x + b.x, 
        y: a.y + b.y, 
        z: a.z + b.z
    };
    return [res];
}

export function distance(a, b) {
    let aa = a.x - b.x;
    let bb = a.y - b.y;
    let cc = a.z - b.z;
    let dis = Math.pow(aa*aa + bb*bb + cc*cc, 0.5);
    return [dis];
}
