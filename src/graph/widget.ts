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

import { Operation } from "./operation";
import { State } from "./state";

export enum WidgetType {
    Input, // static input or UI 
    Middle, // store / look at data
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

    public constructor(
        public readonly name: string,
        public readonly inputs: number, 
        public readonly outputs: number,
        public readonly type: WidgetType,
        public readonly state: State,
    ) {}

    static new(name: string, type: WidgetType, state?: State) {
        return new Widget(
            name, 
            1,
            1,
            type,
            state ? state : false,
            );
    }

    run(...args: boolean[]) {
        console.log("RUNNING!");
    }

    log() {
        console.log(`widget: ${this.name}`);    
    }

    clone() {
        return Widget.new(this.name, this.type, this.state);
    }

    // TODO : customize the heck out of this thing: onLoad, onRun, afterRun, spawnHTML, whatever!
}