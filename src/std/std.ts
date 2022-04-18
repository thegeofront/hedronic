import { makeMenuAction } from "../menu/actions/add";
import { MenuDivider } from "../menu/logic/menu-divider";
import { MenuItem } from "../menu/logic/menu-item";
import { MenuList } from "../menu/logic/menu-list";
import { Catalogue } from "../modules/catalogue";
import { FunctionShim } from "../modules/shims/function-shim";
import { BasicFunctions } from "./functions/math/basic";
import { LogicFunctions } from "./functions/math/logic";
import { StatFunctions } from "./functions/math/statistics";
import { Divider, STDTree } from "./std-system";
import { ButtonWidget } from "./widgets/button-widget";
import { ConsoleWidget } from "./widgets/console-widget";
import { GetWidget } from "./widgets/data/get-widget";
import { ListSetWidget } from "./widgets/data/list-widget";
import { SetWidget } from "./widgets/data/set-widget";
import { FileLoadWidget } from "./widgets/file-load-widget";
import { FileSaveWidget } from "./widgets/file-save-widget";
import { ImageWidget } from "./widgets/image-widget";
import { InputWidget } from "./widgets/input-widget";
import { InspectWidget } from "./widgets/inspect-widget";
import { LampWidget } from "./widgets/lamp-widget";
import { SliderWidget } from "./widgets/slider-widget";
import { ViewWidget } from "./widgets/view-widget";
import { Range1 } from "./functions/math/range/range-1";
import { GFTypes } from "./geofront-types";
import { TypeShim } from "../modules/shims/type-shim";
import { Random } from "./functions/math/random";
import { Range2 } from "./functions/math/range/range-2";
import { Range3 } from "./functions/math/range/range-3";
import { Point } from "./functions/v0/point";
import { MapTree } from "../util/maptree";
import { Vector } from "./functions/v0/vector";
import { Mesh } from "./functions/v3/mesh";
import { MultiPoint } from "./functions/v0/multi-point";
import { Noise } from "./functions/math/noise";

/**
 * NOTE: this WHOLE folder exist just in order to create this
 */

/**
 * The internal, standard library of geofront  
 */
export class STD {

    constructor(
        public map: STDTree,
        public types: Map<GFTypes, TypeShim>
    ) {}

    static default() : STD {

        // I'm making TODO art here
        let TODO = (todo: string) => FunctionShim.newFromFunction((a: number)=> {alert(todo)}, ["todo"])
        let TODO_CLASS = [TODO("TODO: Create this class!")];
        let TODO_LIBRARY = [TODO("TODO: Create this library!")];
        let TODO_SPECIAL = [TODO("TODO: Create this special feature!")];


        let map = function(list: (FunctionShim | Divider)[]) : MapTree<FunctionShim | "divider"> {
            let mapped = list.map((item, index) : [string, FunctionShim | "divider"] => {
                if (item == "divider") {
                    return ["divider" + index, "divider"];
                } else {
                    return [item.name, item];
                }
            });
            let tree = MapTree.new(mapped);
            return tree;
        }

        // explain: 
        // I want do specifically define the order, dividers, have nice names, etc. 
        // BUT, we also want the same structure to be 'machine accessible', using a series of key strings: 
        // `math.basic.sin()`
        // This is the best compromise I could come up with. 

        let types = new Map<GFTypes, TypeShim>(
            [[GFTypes.Range1, Range1.TypeShim]]
        );
        
        let std = MapTree.new([
            ["Types", MapTree.new([
                ["Converters", map(["divider", "divider", "divider"])]
            ])],
            ["Iterate", MapTree.new([
                ["Sequence", TODO_LIBRARY],
                ["Tree", TODO_LIBRARY],
            ])],
            ["Data", MapTree.new([
                ["List", TODO_SPECIAL],
                ["Json", TODO_SPECIAL],
                ["Table", TODO_SPECIAL],
                ["Map", TODO_SPECIAL],
            ])],
            ["Math", MapTree.new([
                ["Basic", map(BasicFunctions)],
                ["Logic", map(LogicFunctions)],
                ["Stats", map(StatFunctions)],
                ["Random", map(Random.Functions)],
                ["Noise", map(Noise.Functions)],
                ["Range", MapTree.new([
                    ["Range 1", map(Range1.Functions)],
                    ["Range 2", map(Range2.Functions)],
                    ["Range 3", map(Range3.Functions)],
                ])],
            ])],
            ["Raster", MapTree.new([
                ["Color",  map(TODO_CLASS)],
                ["Bitmap", map(TODO_CLASS)],
            ])],
            ["Transform", MapTree.new([
                ["Affine", map(TODO_LIBRARY)],   // simple moving, scaling, rotating
                ["Matrix", map(TODO_CLASS)],     // a Transform class, for joining transformation together
                ["Quaternion", map(TODO_CLASS)], // 
            ])],
            ["0D", MapTree.new([
                ["Point", map(Point.Functions)],
                ["Vector", map(Vector.Functions)],
            ])],
            ["1D", MapTree.new([
                ["Line"    , map(TODO_CLASS)],
                ["Polyline", map(TODO_CLASS)],
                ["Spline"  , map(TODO_CLASS)],
            ])],
            ["2D", MapTree.new([
                ["Triangle", map(TODO_CLASS)],
                ["Polygon", map(TODO_CLASS)],
                ["Spline Surface", map(TODO_CLASS)],
            ])],
            ["3D", MapTree.new([
                ["Mesh", map(Mesh.Functions)],
                ["Solid", map(TODO_CLASS)],
            ])],
            ["Multi", MapTree.new([
                ["Multi Point",    map(MultiPoint.Functions)],
                ["Multi Vector",   map(TODO_CLASS)],
                ["Multi Polyline", map(TODO_CLASS)],
                ["Multi Polygon",  map(TODO_CLASS)],
                ["Multi Mesh",     map(TODO_CLASS)],
            ])],
            ["Misc", MapTree.new([

            ])],
        ])

        console.log(std);

        // typescript does not trust me...
        let tree = std as STDTree

        // create easier function paths 
        tree.forEachLeaf((keys, func) => {
            if (func == "divider") return;
            // let lowered = keys.map(k => k.toLowerCase().replace(' ', ''));
            func.path = ["std", ...keys];
        });

        return new STD(tree as STDTree, types);
    }


    /**
     * Path to the function, lowercase, not starting with std
     */
    get(relativePath: string[]) : FunctionShim | undefined {
        let leaf = this.map.getLeaf(relativePath);
        if (leaf == "divider") return undefined;
        return leaf;
    }

    find(fragments: string[]) {
        let leaf = this.map.find(fragments);
        if (leaf == "divider") return undefined;
        console.log(leaf);
        return leaf;
    }

    toMenu(cat: Catalogue) : MenuItem[] {

        // create 'make' functions at leaves
        let callback = (key: string, value: FunctionShim) => {
            return makeMenuAction(cat, value, key);
        }

        // recurse
        let convert = (map: MapTree<FunctionShim | Divider>) : MenuItem[] => {
            let items = [];
            for (let [key, value] of map.tree.entries()) {
                if (value instanceof MapTree) {
                    items.push(MenuList.new(key, convert(value)));
                } else if (value == "divider") {
                    items.push(MenuDivider.new());
                } else {
                    items.push(callback(key, value));
                }
            }
            return items;
        }

        return convert(this.map);
    }

}

export function getDefaultWidgets() {
    return [
        ButtonWidget.new(false),
        InputWidget.new("hello world"),
        SliderWidget.new(5),
        LampWidget.new(false),
        ConsoleWidget.new(false),
        ImageWidget.new("<image>"),
        ViewWidget.new(false),
        FileSaveWidget.new(false),
        FileLoadWidget.new(false),
        InspectWidget.new({}),
        ListSetWidget.new(3),
        GetWidget.new({keys: [], types: []}),
        SetWidget.new(3),
    ]
}