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
        MenuAction.new(context, "Duplcate", duplicate, [Key.Ctrl, Key.D]),
        MenuDivider.new(),
        MenuAction.new(context, "Select all", selectAll, [Key.Ctrl, Key.A]),
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


async function cut(nodes: NodesCanvas) {
    let str = nodes.onCut();
    navigator.clipboard.writeText(str);
}


async function copy(nodes: NodesCanvas) {
    let str = nodes.onCopy();
    navigator.clipboard.writeText(str);
}


async function paste(nodes: NodesCanvas) {
    let str = await navigator.clipboard.readText();
    nodes.onPaste(str);
}


function duplicate(nodes: NodesCanvas) {
    nodes.onDuplicate();
}


function selectAll(nodes: NodesCanvas) {
    nodes.onSelectAll();
}