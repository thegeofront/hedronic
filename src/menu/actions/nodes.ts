import { Key } from "../../../../engine/src/lib";
import { Catalogue } from "../../modules/catalogue";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuAction } from "../logic/menu-action";
import { MenuDivider } from "../logic/menu-divider";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";


export function getNodesActions(context: NodesCanvas) : MenuItem[] {
    return [
        MenuAction.new(context, "Prompt...", prompt, [Key.Enter]),
        // MenuDivider.new(),
    ];
} 


function prompt(nodes: NodesCanvas) {
    console.log("prompto")
}