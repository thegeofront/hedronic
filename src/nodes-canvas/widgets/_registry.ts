import { ButtonWidget } from "./button-widget";
import { ConsoleWidget } from "./console-widget";
import { ListGetWidget } from "./data/list-get-widget";
import { ListSetWidget } from "./data/list-set-widget";
import { FileReadWidget } from "./file-read-widget";
import { FileWriteWidget } from "./file-write-widget";
import { ImageWidget } from "./image-widget";
import { InputWidget } from "./input-widget";
import { LampWidget } from "./lamp-widget";
import { SliderWidget } from "./slider-widget";
import { ViewWidget } from "./view-widget";

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

        ListGetWidget.new(3),
        ListSetWidget.new(3),
    ]
}