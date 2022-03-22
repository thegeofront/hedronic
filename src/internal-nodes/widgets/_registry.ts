import { ButtonWidget } from "./button-widget";
import { ConsoleWidget } from "./console-widget";
import { ListGetWidget } from "./data/items-widget";
import { ListSetWidget } from "./data/list-widget";
import { FileReadWidget } from "./file-read-widget";
import { FileWriteWidget } from "./file-write-widget";
import { ImageWidget } from "./image-widget";
import { InputWidget } from "./input-widget";
import { LampWidget } from "./lamp-widget";
import { InspectWidget } from "./inspect-widget";
import { SliderWidget } from "./slider-widget";
import { ViewWidget } from "./view-widget";
import { GetterWidget } from "./data/getter-widget";
import { SetterWidget } from "./data/setter-widget";

export function getDefaultWidgets() {
    return [
        ButtonWidget.new(false),
        InputWidget.new("hello world"),
        SliderWidget.new(5),
        LampWidget.new(false),
        ConsoleWidget.new(false),
        ImageWidget.new("<image>"),
        ViewWidget.new(false),
        FileWriteWidget.new(false),
        FileReadWidget.new(false),
        InspectWidget.new({}),
        ListGetWidget.new(3),
        ListSetWidget.new(3),
        GetterWidget.new([]),
        SetterWidget.new(3),
    ]
}