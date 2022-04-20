import { Key } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../logic/menu-action";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";

export function getSettingsActions(context: NodesCanvas) : MenuItem[] {
    return [
        MenuAction.new(context, "Plugins...", settings, [Key.Ctrl, Key.H]),
    ];
} 

function settings(context: NodesCanvas) {
    console.log("allalalalaaw");
}