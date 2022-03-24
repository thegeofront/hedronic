import { FunctionShim } from "../modules/shims/function-shim";
import { getSequencingFunctions } from "./operations/sequencing";
import { getTriangulateFunctions } from "./operations/triangulation";
import { ButtonWidget } from "./widgets/button-widget";
import { ConsoleWidget } from "./widgets/console-widget";
import { GetWidget } from "./widgets/data/get-widget";
import { ItemsWidget } from "./widgets/data/items-widget";
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


export function getDefaultFunctions() : FunctionShim[] {
    return [
        ...getSequencingFunctions(),
        ...getTriangulateFunctions()
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
        ItemsWidget.new(3),
        ListSetWidget.new(3),
        GetWidget.new(undefined),
        SetWidget.new(3),
    ]
}