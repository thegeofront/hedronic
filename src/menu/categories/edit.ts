import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../items/menu-action";
import { MenuDivider } from "../items/menu-divider";
import { MenuItem } from "../items/menu-item";
import { MenuList } from "../items/menu-list";


export function getEditActions() : MenuItem[] {
    return [
        MenuAction.new("Undo", undo, [Key.Ctrl, Key.Z]),
        MenuAction.new("Redo", redo, [Key.Ctrl, Key.Y]),
    ];
} 

function undo(n: NodesCanvas) {
    console.log("yay undo");
}

function redo(n: NodesCanvas) {
    console.log("yay redo");
}