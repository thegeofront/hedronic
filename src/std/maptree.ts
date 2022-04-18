import { visitNode } from "typescript";
import { javascript } from "webpack";
import { Debug, DebugRenderer } from "../../../engine/src/lib";

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

    /**
     * if we have `Math->Boolean->And()`, and fragments is `["bool", "and"]`, return `And()` 
     * @param fragment 
     */
    find(fragment: string[]) : T | undefined {
        
        if (fragment.length == 0) return undefined;

        let testFragment = (fragA: string[], fragB: string[], test: (a: string, b: string) => boolean) => {
            for (let [ia, a] of fragA.entries()) {
                let ib = fragB.length - fragA.length + ia;

                if (ib < 0 || ib >= fragB.length) return false;
                let b = fragB[ib];
           
                // THE test
                if (!test(a, b)) {
                    return false;
                }
            }
            return true;
        }

        let test = (a: string, b: string) => b.toLowerCase().replace(' ','').includes(a);
     
        let lowFrag = fragment.map(s => s.toLowerCase().replace(' ',''));
        console.log("looking for fragment", fragment);
        
        let val = this.forEachLeaf((keys: string[], value) => {
            if (testFragment(lowFrag, keys, test)) {
                Debug.log("chosen: ", keys);
                return value;
                
            }
        })
    

        return val;
    }

    getLeaf(key: string[]) : T | undefined {
        let maybeLeaf = this.get(key);
        if (maybeLeaf instanceof MapTree) return undefined;
        return maybeLeaf;
    }

    forEachLeaf<R>(callback: (keys: string[], value: T) => R | undefined) {

        let recurse = (map: MapTree<T>, keyStack: string[]) : R | undefined => {
            for (let [key, value] of map.tree.entries()) {
                let stack = [...keyStack, key];
                if (value instanceof MapTree) {
                    let res = recurse(value, stack);
                    if (res) return res;
                } else {
                    let res = callback(stack, value);
                    if (res) return res;
                }
            }
            return undefined;
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