import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";

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
export class MenuAction {

    constructor(
        public name: string,
        public action: (n: NodesCanvas) => void,
        public defaultShortcut?: Key[],
        public defaultAltShortcut?: Key[],
        ) {}   
    
    static new(
        name: string,
        action: (n: NodesCanvas) => void,
        defaultShortcut?: Key[],
        defaultAltShortcut?: Key[],
        ) {
        return new MenuAction(name, action, defaultShortcut, defaultAltShortcut);
    }
}