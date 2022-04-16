import { FunctionShim } from "../modules/shims/function-shim";

export type Divider = "divider";

export type STDTree = MapTree<FunctionShim | Divider>;

/**
 * Shorthander for quickly making a functionshim
 */
export function make(fn: Function) : [string, FunctionShim ] {
    return [fn.name, FunctionShim.newFromFunction(fn)];
}


/**
 * Shorthander for quickly making a functionshim
 */
 export function func(name: string, fn: Function) : [string, FunctionShim ] {
    return [name || fn.name, FunctionShim.newFromFunction(fn)];
}

/**
 * Shorthander for making a divider
 */
export function divider() : [string, Divider] {
    return ["divider", "divider"];
} 

/**
 * Utility class of a nested hashmap
 */
export class MapTree<T> {
   
    constructor(
        public tree: Map<string, MapTree<T> | T>,
    ) {}

    static new<T>(kvps: [string, MapTree<T> | T][]) {
        let map = new MapTree(new Map<string, T>());
        kvps.forEach(([key, value]) => map.tree.set(key, value));
        return map;
    }

    static newLeaf<T>(key: string, value: T) {
        let map = new MapTree(new Map<string, T>());
        map.tree.set(key, value);
        return map;
    }

    get(key: string[]) : MapTree<T> | T | undefined {
        console.log(key);
        if (key.length == 0) return undefined;
        if (key.length == 1) return this.tree.get(key[0]);
        let branch = this.tree.get(key[0]);
        if (branch instanceof MapTree) {
            return branch.get(key.slice(1));
        }
        return undefined;
    }

    has(key: string[]) {
        return this.get(key) !== undefined;
    }

    getLeaf(key: string[]) : T | undefined {
        let maybeLeaf = this.get(key);
        if (maybeLeaf instanceof MapTree) return undefined;
        return maybeLeaf;
    }

    forEachLeaf(callback: (keys: string[], value: T) => void) {

        let recurse = (map: MapTree<T>, keyStack: string[]) => {
            for (let [key, value] of map.tree.entries()) {
                let stack = [...keyStack, key];
                if (value instanceof MapTree) {
                    recurse(value, stack);
                } else {
                    callback(stack, value);
                }
            }
        }
        return recurse(this, []);
    }
}


///////////////////////////////////////////////////////////////////////////////


function test() {

    let assert_eq = (a: any, b: any) => {
        console.log(a, "should be", b);
        if (a !== b) {
            console.warn("assertion failed");
        }
    }

    console.log("testseetsttesetsteset");

    let tree: MapTree<number> = MapTree.new([
        ["Roos", MapTree.new([["A", 1]])],
        ["Kaas", MapTree.new([["A", 3]])],
        ["Henk", MapTree.new([["A", 4]])],
        ["Worst", MapTree.new([
            ["Vis", 5],
            ["Vis", 5],
            ["Maas", MapTree.new([
                ["Henkie", 12]
            ])]
        ])]
    ]);

    assert_eq(tree.has(["Roos", "A"]), true);
    assert_eq(tree.has(["Types", "Poep"]), false);
    assert_eq(tree.getLeaf(["Worst", "Maas", "Henkie"])!, 12);
    // assert_eq(std.get(["Types", "Poep"])!, true);
    // assert_eq(std.has(["Maan", "Types", "Henk", "Kees"]), false);
    // assert_eq(std.has(["Types", "Poep"]), true);
    // assert_eq(std.get(["Types", "Poep"])!, true);
}