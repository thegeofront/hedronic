import { Key } from "../../../engine/src/lib";
import { NodesCanvas } from "../nodes-canvas/nodes-canvas";
import { MenuAction } from "./action";

export const FileActions = [
    MenuAction.new("New",       fileNew, [Key.Ctrl, Key.N]),
    MenuAction.new("Load json",  fileLoadJson, [Key.Ctrl, Key.O]),
    MenuAction.new("Load js",    fileLoadJs),
    MenuAction.new("Save as json",  fileSaveJson, [Key.Ctrl, Key.S]),
    MenuAction.new("Save as js",    fileSaveJs)
] 

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





