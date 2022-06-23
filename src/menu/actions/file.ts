import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../logic/menu-action";
import { MenuDivider } from "../logic/menu-divider";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";


export function getFileActions(context: NodesCanvas) : MenuItem[] {
    
    return [
        MenuAction.new(context, "New", fileNew, [Key.Ctrl, Key.Shift, Key.N]),
        MenuDivider.new(),
        MenuAction.new(context, "Load...", fileLoadJson, [Key.Ctrl, Key.O]),
        // MenuAction.new(context, "Load js", fileLoadJs),
        MenuDivider.new(),
        MenuAction.new(context, "Save", fileSaveJson, [Key.Ctrl, Key.S]),
        // MenuAction.new(context, "Save js...", fileSaveJs),
        // MenuDivider.new(),
        // MenuAction.new(context, "Import...", fileSaveJson),
        // MenuAction.new(context, "Export...", fileSaveJs),
        // MenuDivider.new(),
    ];
} 

function fileNew(n: NodesCanvas) {
    console.log("new");
    n.resetGraphAndCatalogue();
}

function fileLoadJson(n: NodesCanvas) {
    console.log("load json");
    n.onLoad();
}

function fileLoadJs(n: NodesCanvas) {
    console.log("load js");
    n.onLoadJs();
}

function fileSaveJson(n: NodesCanvas) {
    console.log("save json");
    n.onSave();
}

function fileSaveJs(n: NodesCanvas) {
    console.log("save js");
    n.onSaveJs();
}




