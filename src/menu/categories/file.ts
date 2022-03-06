import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../items/menu-action";
import { MenuDivider } from "../items/menu-divider";
import { MenuItem } from "../items/menu-item";
import { MenuList } from "../items/menu-list";


export function getFileActions() : MenuItem[] {
    return [
        MenuAction.new("New",       fileNew, [Key.Ctrl, Key.N]),
        MenuDivider.new(),
        MenuAction.new("Load json",  fileLoadJson, [Key.Ctrl, Key.O]),
        MenuAction.new("Load js",    fileLoadJs),
        MenuDivider.new(),
        MenuAction.new("Save",  fileSaveJson, [Key.Ctrl, Key.S]),
        MenuAction.new("Save as...",    fileSaveJs),
        MenuDivider.new(),
        MenuAction.new("Import...",  fileSaveJson),
        MenuAction.new("Export...",    fileSaveJs),
        MenuDivider.new(),
        
        MenuList.new("items", [
            MenuAction.new("Save as js",    test),
            MenuAction.new("Save as js",    test),
            MenuAction.new("Save as js",    test),
        ])
    ];
} 

function fileNew(n: NodesCanvas) {
    console.log("new");
}

function fileLoadJson(n: NodesCanvas) {
    console.log("load json");
}

function fileLoadJs(n: NodesCanvas) {
    console.log("load js");
}

function fileSaveJson(n: NodesCanvas) {
    console.log("save json");
}

function fileSaveJs(n: NodesCanvas) {
    console.log("save js");
}

function test(this: NodesCanvas) {

}





