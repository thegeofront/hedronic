import { StandardFunctions } from "./standard-functions";
import { FN, Operation } from "../graph/operation";
import { GeonNode } from "../graph/node";
import { Vector2 } from "../../../engine/src/lib";
import { Widget, WidgetSide } from "../graph/widget";
import { ButtonWidget } from "../widgets/button-widget";
import { ConsoleWidget } from "../widgets/display-widget";
import { LampWidget } from "../widgets/lamp-widget";
import { TextWidget } from "../widgets/text-widget";

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

    constructor(public name: string, public operations: Operation[], public widgets: Widget[]) {

    }

    static new(name: string, ops: Operation[], giz: Widget[]) : Catalogue {
        return new Catalogue(name, ops, giz);
    }

    static newDefault() {
        let operations: Operation[] = StandardFunctions.map(fn => Operation.new(fn));
        let widgets: Widget[] = [
            ButtonWidget.new(false),
            TextWidget.new("hello world"),
            LampWidget.new(false),
            ConsoleWidget.new(false),
        ]
        return Catalogue.new("GEON", operations, widgets);
    }

    trySelect(key: string, type: CoreType) {
        if (type == CoreType.Operation) {
            for (let i = 0 ; i < this.operations.length; i++) {
                if (key == this.operations[i].name) {
                    return this.select(i, type);
                }
            }
        } else {
            for (let i = 0 ; i < this.widgets.length; i++) {
                if (key == this.widgets[i].name) {
                    return this.select(i, type);
                }
            }
        }
        return undefined;
    }

    select(idx: number, type: CoreType) {
        console.log(`select id: ${idx} type: ${type}`);
        if (type == CoreType.Operation) {
            this.selected = this.operations[idx];
        } else {
            this.selected = this.widgets[idx];
        }
        return this.selected;
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
}