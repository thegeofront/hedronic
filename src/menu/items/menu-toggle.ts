import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuItem } from "./menu-item";

/**
 * @example 
 * ```ts
 * class NewAction extends MenuAction {
 *     constructor() {
 *         super([Key.Control, Key.N])
 *     }
 * }
 * ```
 */
export class MenuToggle extends MenuItem {

    active = true;
    checked = false;

    constructor(
        public name: string,
        public onCheck: Function,
        public onUncheck: Function,
        public defaultShortcut?: Key[],
        ) {
            super();
        }   
    
    static new(
        name: string,
        onCheck: Function,
        onUncheck: Function,
        defaultShortcut?: Key[],
        defaultAltShortcut?: Key[],
        ) {
        return new MenuToggle(name, onCheck, onUncheck, defaultShortcut);
    }

    do() {
        if (this.active) {
            this.active = false;
            this.onUncheck()
        } else {
            this.active = true;
            this.onCheck()
        }
    }
}