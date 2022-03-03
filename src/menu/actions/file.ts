// dom.addButton("button", this.canvas.onNew.bind(this.canvas)).addText("New").up().up();
// dom.addButton("button", this.canvas.onLoad.bind(this.canvas)).addText("Load").up().up();
// dom.addButton("button", this.canvas.onLoadJs.bind(this.canvas)).addText("Load Js").up().up();
// dom.addButton("button", this.canvas.onSave.bind(this.canvas)).addText("Save").up().up();
// dom.addButton("button", this.canvas.onSaveJs.bind(this.canvas)).addText("Save Js").up().up();

import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "./menu-action";

export const FileActions = [
    MenuAction.new("New",       fileNew, [Key.Ctrl, Key.N]),
    MenuAction.new("Load json",  fileLoadJson, [Key.Ctrl, Key.O]),
    MenuAction.new("Load js",    fileLoadJs),
    MenuAction.new("Save as json",  fileSaveJson, [Key.Ctrl, Key.S]),
    MenuAction.new("Save as js",    fileSaveJs)
] 

function fileNew(n: NodesCanvas) {

}

function fileLoadJson(n: NodesCanvas) {

}

function fileLoadJs(n: NodesCanvas) {

}

function fileSaveJson(n: NodesCanvas) {

}

function fileSaveJs(n: NodesCanvas) {

}





