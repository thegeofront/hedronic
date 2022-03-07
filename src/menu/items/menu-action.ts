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
export class MenuAction extends MenuItem {

    active = true;

    constructor(
        public name: string,
        public action: Function,
        public defaultShortcut?: Key[],
        ) {
            super();
        }   
    
    static new(
        name: string,
        action: Function,
        defaultShortcut?: Key[],
        ) {
        return new MenuAction(name, action, defaultShortcut);
    }

    do() {
        this.action();
    }

    render(): HTMLElement {
        throw new Error("Method not implemented.");
    }
}