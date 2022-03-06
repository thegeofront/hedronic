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
    checked = false;

    constructor(
        public name: string,
        public action: (n: NodesCanvas) => void,
        public defaultShortcut?: Key[],
        public defaultAltShortcut?: Key[],
        ) {
            super();
        }   
    
    static new(
        name: string,
        action: (n: NodesCanvas) => void,
        defaultShortcut?: Key[],
        defaultAltShortcut?: Key[],
        ) {
        return new MenuAction(name, action, defaultShortcut, defaultAltShortcut);
    }
}