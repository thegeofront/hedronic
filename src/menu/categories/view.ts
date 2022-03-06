import { Key } from "../../../../engine/src/lib";
import { hideRightPanel, showRightPanel } from "../../html/registry";
import { HTML } from "../../html/util";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../items/menu-action";
import { MenuItem } from "../items/menu-item";
import { MenuToggle } from "../items/menu-toggle";

export function getViewActions() : MenuItem[] {
    return [
        MenuToggle.new("Show right panel", activateSidebar, deactivateSidebar, [Key.Ctrl, Key.H]),
        MenuToggle.new("Show left panel", activateSidebar, deactivateSidebar, [Key.Ctrl, Key.J]),
    ];
}

function activateSidebar() {
    HTML.dispatch(showRightPanel);
}

function deactivateSidebar() {
    HTML.dispatch(hideRightPanel);
}