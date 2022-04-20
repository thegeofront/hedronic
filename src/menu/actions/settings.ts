import { Key } from "../../../../engine/src/lib";
import { MainTab, TabMainEvent } from "../../html/registry";
import { HTML } from "../../html/util";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../logic/menu-action";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";

export function getSettingsActions(context: NodesCanvas) : MenuItem[] {
    return [
        MenuAction.new(context, "Plugins...", settings, [Key.Ctrl, Key.Zero]),
    ];
} 

function settings(context: NodesCanvas) {
    console.log("Opening plugins");
    HTML.dispatch(TabMainEvent, MainTab.Plugins);
}