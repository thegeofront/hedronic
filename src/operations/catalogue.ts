import { defaultOperations } from "./default-catalogue";
import { FN, Operation } from "../graph/operation";
import { GeonNode } from "../graph/node";
import { Vector2 } from "../../../engine/src/lib";
import { Widget, WidgetSide } from "../graph/widget";
import { ButtonWidget } from "../widgets/button-widget";

// TODO rename CORE to TYPE
//      rename NODE to INSTANCE maybe


export enum CoreType {
    Operation,
    Gizmo
}

/**
 * Catalogue containing all cores
 * Cores contain functionality of a node
 * 
 * In the future, this would make creating a menu easier
 * TODO: Categories
 */
export class Catalogue {

    public selected?: Operation | Widget

    constructor(public operations: Operation[], public widgets: Widget[]) {

    }

    static new(ops: Operation[], giz: Widget[]) : Catalogue {
        return new Catalogue(ops, giz);
    }

    static newDefault() {
        let operations: Operation[] = defaultOperations.map(fn => Operation.new(fn));
        let widgets: Widget[] = [
            ButtonWidget.new("button", WidgetSide.Input, false, Vector2.new(1,1)),
            Widget.new("text", WidgetSide.Input, false, Vector2.new(4,1)),
            Widget.new("output", WidgetSide.Output, false, Vector2.new(1,1)),
            Widget.new("display", WidgetSide.Output, false, Vector2.new(3,3)),
        ]
        return Catalogue.new(operations, widgets);
    }

    select(idx: number, type: CoreType) {
        
        console.log(`select id: ${idx} type: ${type}`);
        if (type == CoreType.Operation) {
            this.selected = this.operations[idx];
        } else {
            this.selected = this.widgets[idx];
        }
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
            console.log(this.selected instanceof ButtonWidget);
            return GeonNode.newWidget(gp, this.selected.clone());
        }
    }
}