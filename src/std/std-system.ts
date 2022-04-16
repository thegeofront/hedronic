import { FunctionShim } from "../modules/shims/function-shim";

export type Divider = "divider";

/**
 * Utility class of a nested hashmap
 */
class MapTree<T> {
   
    constructor(
        public tree: Map<string, MapTree<T> | T>,
    ) {}

    static new<T>(kvps: [string, MapTree<T> | T][]) {
        let tree = new MapTree(new Map<string, T>());
        kvps.forEach(([key, value]) => tree.tree.set(key, value));
        return tree;
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
}

export class STD {

    constructor(
        public functions: MapTree<FunctionShim>[]
    ) {}

    static default() {

        // I'm making TODO art here
        let TODO = (todo: string) => [FunctionShim.newFromFunction((a: number)=> {alert(todo)}, ["todo"])]
        let TODO_CLASS = TODO("Create this class!");
        let TODO_LIBRARY = TODO("Create this library!");
        let TODO_SPECIAL = TODO("Create this special feature!");
    

        // NamedTree.new("Types", [
        //     NamedTree.new("Converters", TODO_SPECIAL), // we need a way of going from a vector to a point, or any {x,y,z} json to a point
        // ]),
        // NamedTree.new("Iterate", [
        //     NamedTree.new("Sequence", TODO_LIBRARY), // iterate, toIterable
        //     NamedTree.new("Tree", TODO_LIBRARY), // graph, flatten
        // ]), 
        // NamedTree.new("Data", [
        //     NamedTree.new("List", TODO_SPECIAL),  
        //     NamedTree.new("Json", TODO_SPECIAL),  // Get, Set
        //     NamedTree.new("Table", TODO_SPECIAL), 
        //     NamedTree.new("Map", TODO_SPECIAL),
        // ]),
        // NamedTree.new("Math", [
        //     NamedTree.new("Stats", TODO_LIBRARY),
        //     NamedTree.new("Random", TODO_CLASS),
        //     NamedTree.new("Logic", TODO_LIBRARY),
        //     NamedTree.new("Basic", TODO_LIBRARY),
        //     NamedTree.new("Range", [
        //         NamedTree.new("Range-1", TODO_CLASS),
        //         NamedTree.new("Range-2", TODO_CLASS),
        //         NamedTree.new("Range-3", TODO_CLASS)
        //     ]),
        // ]),
        // NamedTree.new("Raster", [
        //     NamedTree.new("Color", TODO_CLASS),
        //     NamedTree.new("Bitmap", TODO_CLASS),
        // ]),
        // NamedTree.new("Transform", [
        //     NamedTree.new("Affine", TODO_LIBRARY),
        //     NamedTree.new("Matrix", TODO_CLASS),
        //     NamedTree.new("Quaternion", TODO_CLASS)
        // ]),
        // NamedTree.new("Vector 0D", [
        //     NamedTree.new("Point", TODO_CLASS),
        //     NamedTree.new("Vector", TODO_CLASS),
        // ]),
        // NamedTree.new("Vector 1D", [
        //     NamedTree.new("Line", TODO_CLASS]),
        //     NamedTree.new("Polyline", TODO_CLASS),
        //     NamedTree.new("Nurbs Curve", TODO_CLASS),
        // ]),
        // NamedTree.new("Vector 2D", [
        //     NamedTree.new("Triangle", TODO_CLASS),
        //     NamedTree.new("Polygon", TODO_CLASS),
        //     NamedTree.new("Nurbs Surface", TODO_CLASS),
        // ]),
        // NamedTree.new("Vector 3D", [
        //     NamedTree.new("Mesh", TODO_CLASS),
        //     NamedTree.new("Solid", TODO_CLASS),
        // ]),
        // NamedTree.new("Vector Multi", [
        //     NamedTree.new("MultiPoint", TODO_CLASS),
        //     NamedTree.new("MultiVector", TODO_CLASS),
        //     NamedTree.new("MultiPolyline", TODO_CLASS),
        //     NamedTree.new("MultiPolygon", TODO_CLASS),
        //     NamedTree.new("MultiMesh", TODO_CLASS),
        // ]),
        // NamedTree.new("Misc", [])];
    }

}

test();

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