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
        MenuDivider.new(),
        MenuAction.new(context, "Cut", cut, [Key.Ctrl, Key.X]),
        MenuAction.new(context, "Copy", copy, [Key.Ctrl, Key.C]),
        MenuAction.new(context, "Paste", paste, [Key.Ctrl, Key.V]),
    ];
} 

function undo(nodes: NodesCanvas) {
    let change = nodes.graphHistory.undo(); 
    if (change) nodes.onChange();
}

function redo(nodes: NodesCanvas) {
    let change = nodes.graphHistory.redo(); 
    if (change) nodes.onChange();
}

function cut() {
    console.log("hello");
}

function copy() {
    console.log("hello");
}

function paste() {
    console.log("hello");
}