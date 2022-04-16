import { makeMenuAction } from "../menu/actions/add";
import { MenuAction } from "../menu/logic/menu-action";
import { MenuDivider } from "../menu/logic/menu-divider";
import { MenuItem } from "../menu/logic/menu-item";
import { MenuList } from "../menu/logic/menu-list";
import { Catalogue } from "../modules/catalogue";
import { FunctionShim } from "../modules/shims/function-shim";
import { basic } from "./functions/math/basic";
import { getColorFunctions } from "./operations/color";
import { getMathFunctions } from "./operations/math";
import { getPolygonFunctions } from "./operations/polygon";
import { getSequencingFunctions } from "./operations/sequencing";
import { Divider, MapTree, STDTree } from "./std-system";
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

export class STD {

    constructor(
        public std: STDTree
    ) {}

    static default() : STD {

        // I'm making TODO art here
        let TODO = (todo: string) => FunctionShim.newFromFunction((a: number)=> {alert(todo)}, ["todo"])
        let TODO_CLASS = TODO("TODO: Create this class!");
        let TODO_LIBRARY = TODO("TODO: Create this library!");
        let TODO_SPECIAL = TODO("TODO: Create this special feature!");

        let std = MapTree.new([
            ["Types", MapTree.new([
                ["Converters", TODO_SPECIAL]
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
                ["Basic", basic(["Math","Basic"])],
                ["Logic", MapTree.newLeaf("todo", TODO_LIBRARY)],
                ["Stats", MapTree.newLeaf("todo", TODO_LIBRARY)],
                ["Random", MapTree.newLeaf("todo", TODO_LIBRARY)],
                ["Range", MapTree.new([
                    ["Range-1", TODO_CLASS],
                    ["Range-2", TODO_CLASS],
                    ["Range-3", TODO_CLASS],
                ])],
            ])],
            ["Raster", MapTree.new([
                ["Color", TODO_CLASS],
                ["Bitmap", TODO_CLASS],
            ])],
            ["Transform", MapTree.new([
                ["Affine", TODO_LIBRARY],   // simple moving, scaling, rotating
                ["Matrix", TODO_CLASS],     // a Transform class, for joining transformation together
                ["Quaternion", TODO_CLASS], // 
            ])],
            ["Vector 0", MapTree.new([
                ["Point", TODO_CLASS],
                ["Vector", TODO_CLASS],
            ])],
            ["Vector 1", MapTree.new([
                ["Line"    , TODO_CLASS],
                ["Polyline", TODO_CLASS],
                ["Spline"  , TODO_CLASS],
            ])],
            ["Vector 2", MapTree.new([
                ["Triangle", TODO_CLASS],
                ["Polygon", TODO_CLASS],
                ["Spline Surface", TODO_CLASS],
            ])],
            ["Vector 3", MapTree.new([
                ["Mesh", TODO_CLASS],
                ["Solid", TODO_CLASS],
            ])],
            ["Vector Multi", MapTree.new([
                ["Multi Point",    TODO_CLASS],
                ["Multi Vector",   TODO_CLASS],
                ["Multi Polyline", TODO_CLASS],
                ["Multi Polygon",  TODO_CLASS],
                ["Multi Mesh",     TODO_CLASS],
            ])],
            ["Misc", MapTree.new([

            ])],
        ])
        // thrust me, typescript, this will work!
        return new STD(std as STDTree);
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

        return convert(this.std);
    }

}

/**
 * 
 * @returns 
 */
export function getStandardLibraryMenu() {
    // return std;
}

export function getDefaultFunctions() : FunctionShim[] {
    return [
        ...getSequencingFunctions(),
        ...getPolygonFunctions(),
        ...getColorFunctions(),
        ...getMathFunctions(),
    ]
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