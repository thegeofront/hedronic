import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../logic/menu-action";
import { MenuDivider } from "../logic/menu-divider";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";


export function getEditActions(context: NodesCanvas) : MenuItem[] {
    return [
        MenuAction.new(context, "Undo", undo, [Key.Ctrl, Key.Z]),
        MenuAction.new(context, "Redo", redo, [Key.Ctrl, Key.Y]),
    ];
} 

function undo(n: NodesCanvas) {
    console.log("yay undo");
}

function redo(n: NodesCanvas) {
    console.log("yay redo");
}