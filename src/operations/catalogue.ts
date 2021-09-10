import { FN, Operation } from "../graph/operation";
import { GeonNode } from "../graph/node";
import { Vector2 } from "../../../engine/src/lib";
import { Widget, WidgetSide } from "../graph/widget";
import { ButtonWidget } from "../widgets/button-widget";
import { ConsoleWidget } from "../widgets/display-widget";
import { LampWidget } from "../widgets/lamp-widget";
import { TextWidget } from "../widgets/text-widget";
import { NodesModule } from "./module";
import { Module } from "webpack";

// TODO rename CORE to TYPE
//      rename NODE to INSTANCE maybe


export enum CoreType {
    Operation,
    Widget
}

/**
 * Catalogue containing all cores
 * Cores contain functionality of a node
 * 
 * In the future, this would make creating a menu easier
 * TODO: Categories
 */
export class Catalogue {

    public selected?: Operation | Widget;

    constructor(public modules: Map<string, NodesModule>) {}

    static new() : Catalogue {
        return new Catalogue(new Map());
    }

    static newDefault() {
        
        let widgets: Widget[] = [
            ButtonWidget.new(false),
            TextWidget.new("hello world"),
            LampWidget.new(false),
            ConsoleWidget.new(false),
        ]

        let wmap = new Map<string, Widget>();
        for (let w of widgets) {
            wmap.set(w.name, w);
        }

        let cat = Catalogue.new();
        let widMod = NodesModule.new("widgets", [], widgets, cat);
        cat.addModule(widMod);
        return cat;
    }

    allOperations() {

    }

    trySelect(lib: string, key: string, type: CoreType) {
        let mod = this.modules.get(lib);
        if (!mod) {
            throw new Error(`no module is called: ${lib}`);
        }
        mod.select(key, type);
        return this.selected;
    }

    selectCore(core: Operation | Widget | undefined) {
        this.selected = core;
    }

    select(lib: string, key: string, type: CoreType) {
        this.modules.get(lib)!.select(key, type);
    }

    deselect() {
        this.selected = undefined;
    }

    /**
     * Spawn an instance of the selected node at a location 
     */
    spawn(gp: Vector2) {
        if (this.selected instanceof Operation) {
            return GeonNode.new(gp, this.selected);
        } else if (this.selected instanceof Widget) {
            return GeonNode.newWidget(gp, this.selected.clone());
        }
    }

    addModule(mod: NodesModule) {
        this.modules.set(mod.name, mod);
        mod.publishGlobally();
    } 
}