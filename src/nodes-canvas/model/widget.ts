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

import { Domain, Domain2, Vector2 } from "../../../../engine/src/lib";
import { CTX } from "../rendering/ctx/ctx-helpers";
import { NodesCanvas } from "../nodes-canvas";
import { State } from "./state";
import { MUTED_WHITE } from "../rendering/nodes-rendering";
import { TypeShim } from "../../modules/shims/type-shim";

export enum WidgetSide {
    Input, // static input or UI 
    Output, // output: save file , or rendering...
    Process // output: save file , or rendering...
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
    domain?: Domain2;
    onChangeCallback?: (w: Widget) => void;
    onChangeInOutCallback?: Function;
    hash?: string; // the node i'm connected to

    protected constructor(
        public readonly name: string,
        public readonly side: WidgetSide,
        public readonly size: Vector2 | undefined,
        public ins: TypeShim[],
        public outs: TypeShim[],
        public saveState: any,
    ) {
        this.nameLower = name.toLowerCase();
        this.domain = Widget.determineWidgetSize(this.side, this.size);
    }

    get inCount() {
        return this.ins.length;
    }

    get outCount() {
        return this.outs.length;
    }

    static determineWidgetSize(side: WidgetSide, size?: Vector2) {
        // sry for this dumb code
        if (side == WidgetSide.Process) {
            return undefined;
        }

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

    static fromJson() {
        // this will be specific per widget
    }

    attach(hash: string) {
        this.hash = hash;
    }

    detach() {
        this.hash = "";
    }

    toJson() {
        return {
            name: this.name,
            state: this.saveState,
        }
    }

    toJs(inputVariableNames: string[], outputVariableNames: string[]) {
        // this will also be specific per widget
    }

    /**
     * The default behaviour of a widget is a state loader / saver
     */
    async run(...args: State[]) : Promise<State | State[]> {
        if (this.side == WidgetSide.Input) {
            return this.saveState;
        } else if (this.side == WidgetSide.Output) {
            this.saveState = args;
            return [];
        }
        // this.state = args; // default behaviour
        // return this.state;
        return [];
    }

    log() {
        console.log(`widget: ${this.name}`);    
    }

    clone() {
        return new Widget(this.name, this.side, this.size, this.ins, this.outs, this.saveState);;
    }

    trySelect(local: Vector2) : number | undefined {
        if (!this.domain) return undefined;
        if (this.domain.includesEx(local)) {
            return Infinity;
        }
        return undefined;
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {

        if (!this.domain) return;

        let size = this.domain.size().scaled(cellSize);
        const A = 4; // offset A
        const B = 4; // offset B

        pos = pos.clone();
        pos.x += this.domain.x.t0 * cellSize;
        pos.y += this.domain.y.t0 * cellSize;

        ctx.fillStyle = this.saveState ? "ffffff" : "#292C33";

        ctx.fillRect(pos.x+A, pos.y+A, size.x-A*2, size.y-A*2);
        ctx.strokeRect(pos.x+A, pos.y+A, size.x-A*2, size.y-A*2);
      
        ctx.fillStyle = this.saveState ? MUTED_WHITE : "#000000";
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

    onChange() {
        if (this.onChangeCallback) this.onChangeCallback(this);
    }
    
    onUpdateInOutCount() {
        // TODO hook this up!!!! 
        // right now, the dynamic input output widgets will cause errors
        if (this.onChangeInOutCallback) this.onChangeInOutCallback();
    }

    onBeforeRun() {
        
    }

    onDestroy() {
        
    }

    makeMenu() : HTMLElement[] {
        // what do we need to render in the
        return []; 
    }

    makeHTMLWidget() : HTMLElement[] {
        // what do we render within spawned html?
        return []; 
    }

    // TODO : customize the heck out of this thing: onLoad, onRun, afterRun, spawnHTML, whatever!
}