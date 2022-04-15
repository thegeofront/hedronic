import { FunctionShim } from "../modules/shims/function-shim";
import { getColorFunctions } from "./operations/color";
import { getPolygonFunctions } from "./operations/polygon";
import { getSequencingFunctions } from "./operations/sequencing";
import { getVariousFunctions } from "./operations/various";
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



export type StdTree = Map<string, FunctionShim[] | StdTree>;

export function getFullStdTree() : StdTree {
    // typescript does not understand recursive typing 
    // let map = new Map<string, FunctionShim[] | any>([
    //     ["Kaas", []],
    //     ["Henk", new Map([
    //         ["kaas", []],
    //         [ "henk", []]
    //     ])],
    // ]);
    let map = new Map();
    map.set("Types", []) // TODO dumb all constructors here
    map.set("Sets", [])
    map.set("Maths", [])
    map.set("Rendering", [])
    map.set("Raster", [])
    map.set("Zerodim", [])
    map.set("Onedim", [])
    map.set("Twodim", [])
    map.set("Threedim", [])
    map.set("Multi", [])
    map.set("Miscelanious", [])

    // console.log(map);

    return map;
}

export function getDefaultFunctions() : FunctionShim[] {

    return [
        ...getSequencingFunctions(),
        ...getPolygonFunctions(),
        ...getColorFunctions(),
        ...getVariousFunctions(),
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