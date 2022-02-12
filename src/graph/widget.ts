// author:      Jos Feenstra 
// purpose:     We make a distinction between 'normal' nodes, and gizmo's. 
//              gizmo's are 
//                - directly tied to one and only one cable.
//              used as:
//                - global input
//                - global output
//                - visuals
//                - cable management
//
//              also, only gizmo's are allowed to hold state. 
//            

import { Domain, Domain2, Vector2 } from "../../../engine/src/lib";
import { CTX } from "../ctx/ctx-helpers";
import { NodesCanvas } from "../nodes-canvas/nodes-canvas";
import { Blueprint } from "./blueprint";
import { State } from "./state";

export enum WidgetSide {
    Input, // static input or UI 
    Output // output: save file, or rendering...
}

/**
 * 
 * Some Nodes have Widgets. 
 * Widgets contain state, and react upon 
 *  widgets are 
 *    - directly tied to one and only one cable.
 *  used as:
 *    - global input
 *    - global output
 *    - debugging
 *    - visuals
 *    - cable management
 * 
 * Widgets look exactly the same as Operations, and can be used interchangably. BUT, widgets are unique, no two Nodes may point to the same Widget
 */
export class Widget {

    nameLower: string;
    bounds: Domain2;
    inputs: number;
    outputs: number

    public constructor(
        public readonly name: string,
        public readonly side: WidgetSide,
        public readonly size: Vector2,
        public state: State,
    ) {
        this.nameLower = name.toLowerCase();
        this.inputs = side == WidgetSide.Input ? 0 : 1;
        this.outputs = side == WidgetSide.Output ? 0 : 1;
        this.bounds = Widget.determineWidgetSize(this.side, this.size);
    }

    static determineWidgetSize(side: WidgetSide, size?: Vector2) {
        // sry for this dumb code
        if (!size) {
            if (side == WidgetSide.Input) {
                return Domain2.fromWH(0,0,1,1);
            } else {
                return Domain2.fromWH(2,0,1,1);
            }
        } else {
            if (side == WidgetSide.Input) {
                return Domain2.fromWH(-(size.x-2), 0, size.x, size.y);
            } else {
                return Domain2.fromWH(2, 0, size.x, size.y);
            }
        }
    }

    toJson() {
        return {
            namespace: "widgets",
            name: this.name,
            state: this.state,
        }
    }

    run(...args: State[]) : State[] {
        // something
        return [];
    }

    log() {
        console.log(`widget: ${this.name}`);    
    }

    clone() {
        return new Widget(this.name, this.side, this.size, this.state);
    }

    trySelect(local: Vector2) : number | undefined {
   
        if (this.bounds.includesEx(local)) {
            return Infinity;
        }
        return undefined;
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {

        let size = this.bounds.size().scaled(cellSize);
        const A = 4; // offset A
        const B = 4; // offset B

        pos = pos.clone();
        pos.x += this.bounds.x.t0 * cellSize;
        pos.y += this.bounds.y.t0 * cellSize;

        ctx.fillStyle = this.state ? "ffffff" : "#292C33";

        ctx.fillRect(pos.x+A, pos.y+A, size.x-A*2, size.y-A*2);
        ctx.strokeRect(pos.x+A, pos.y+A, size.x-A*2, size.y-A*2);
        
        ctx.fillStyle = this.state ? "#33dd33" : "#000000";
        if (component == Infinity) {
            ctx.fillStyle += "88";
        } 

        ctx.fillRect(pos.x+A+B, pos.y+A+B, size.x-A*2-B*2, size.y-A*2-B*2);
    }

    // ---- Create Special properties

    /**
     * What to do when the widget actually gets clicked
     */
    onClick(canvas: NodesCanvas) {
        canvas.deselect();
    }

    // TODO : customize the heck out of this thing: onLoad, onRun, afterRun, spawnHTML, whatever!
}