import { ButtonWidget } from "./button-widget";
import { ConsoleWidget } from "./console-widget";
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
        ViewWidget.new(false)
    ]
}