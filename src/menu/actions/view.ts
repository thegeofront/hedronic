import { Key } from "../../../../engine/src/lib";
import { hideRightPanel, setRightPanel, showRightPanel } from "../../html/registry";
import { HTML } from "../../html/util";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../logic/menu-action";
import { MenuItem } from "../logic/menu-item";
import { MenuToggle } from "../logic/menu-toggle";

export function getViewActions(nodesCanvas: NodesCanvas) : MenuItem[] {
    return [
        MenuToggle.new("Show right panel", activateSidebar, deactivateSidebar, [Key.Ctrl, Key.J]),
        MenuToggle.new("Show left panel", ()=>{}, ()=>{}, [Key.Ctrl, Key.J]),
    ];
}

function activateSidebar() {
    HTML.dispatch(showRightPanel);
}

function deactivateSidebar() {
    HTML.dispatch(hideRightPanel);
}