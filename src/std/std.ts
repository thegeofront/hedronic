import { MenuAction } from "../menu/logic/menu-action";
import { MenuList } from "../menu/logic/menu-list";
import { FunctionShim } from "../modules/shims/function-shim";
import { getColorFunctions } from "./operations/color";
import { getMathFunctions } from "./operations/math";
import { getPolygonFunctions } from "./operations/polygon";
import { getSequencingFunctions } from "./operations/sequencing";
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

/**
 * 
 * @returns 
 */
export function getStandardLibraryMenu() {
    
    // I'm making TODO art here
    let TODO = (todo: string) => {MenuAction.new(undefined, "TODO: " + todo, () => {alert("TODO: " + todo)});}
    let TODO_CLASS = MenuAction.new(undefined, "TODO", () => {alert("TODO!")});
    let TODO_LIBRARY = MenuAction.new(undefined, "TODO", () => {alert("TODO!")});
    let TODO_SPECIAL = MenuAction.new(undefined, "TODO", () => {alert("TODO!")});
    
    let std = [
        MenuList.new("Types", [
            MenuList.new("Converters", [TODO_SPECIAL]), // we need a way of going from a vector to a point, or any {x,y,z} json to a point
        ]),
        MenuList.new("Iterate", [
            MenuList.new("Sequence", [TODO_LIBRARY]), // iterate, toIterable
            MenuList.new("Tree", [TODO_LIBRARY]), // graph, flatten
        ]), 
        MenuList.new("Data", [
            MenuList.new("List", [TODO_SPECIAL]),  
            MenuList.new("Json", [TODO_SPECIAL]),  // Get, Set
            MenuList.new("Table", [TODO_SPECIAL]), 
            MenuList.new("Map", [TODO_SPECIAL]),
        ]),
        MenuList.new("Math", [
            MenuList.new("Random", [TODO_CLASS]),
            MenuList.new("Logic", [TODO_LIBRARY]),
            MenuList.new("Basic", [TODO_LIBRARY]),
            MenuList.new("Range", [
                MenuList.new("Range-1", [TODO_CLASS]),
                MenuList.new("Range-2", [TODO_CLASS]),
                MenuList.new("Range-3", [TODO_CLASS])
            ]),
        ]),
        MenuList.new("Raster", [
            MenuList.new("Color", [TODO_CLASS]),
            MenuList.new("Bitmap", [TODO_CLASS]),
        ]),
        MenuList.new("Transform", [
            MenuList.new("Affine", [TODO_LIBRARY]),
            MenuList.new("Matrix", [TODO_CLASS]),
            MenuList.new("Quaternion", [TODO_CLASS])
        ]),
        MenuList.new("Vector 0D", [
            MenuList.new("Point", [TODO_CLASS]),
            MenuList.new("Vector", [TODO_CLASS]),
        ]),
        MenuList.new("Vector 1D", [
            MenuList.new("Line", [TODO_CLASS]),
            MenuList.new("Polyline", [TODO_CLASS]),
            MenuList.new("Nurbs Curve", [TODO_CLASS]),
        ]),
        MenuList.new("Vector 2D", [
            MenuList.new("Triangle", [TODO_CLASS]),
            MenuList.new("Polygon", [TODO_CLASS]),
            MenuList.new("Nurbs Surface", [TODO_CLASS]),
        ]),
        MenuList.new("Vector 3D", [
            MenuList.new("Mesh", [TODO_CLASS]),
            MenuList.new("Solid", [TODO_CLASS]),
        ]),
        MenuList.new("Vector Multi", [
            MenuList.new("MultiPoint", [TODO_CLASS]),
            MenuList.new("MultiVector", [TODO_CLASS]),
            MenuList.new("MultiPolyline", [TODO_CLASS]),
            MenuList.new("MultiPolygon", [TODO_CLASS]),
            MenuList.new("MultiMesh", [TODO_CLASS]),
        ]),
        MenuList.new("Misc", [
            
        ]),
    ]

    return std;
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