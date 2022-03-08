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
        MenuList.new("Debug", [
            MenuAction.new(context, "Test 1", test1),
            MenuAction.new(context, "Test 2", test2),
            MenuAction.new(context, "Test 3", test3),
        ])
    ];
} 

function prompt(nodes: NodesCanvas) {
    nodes.onPrompt();
}

function test1(nodes: NodesCanvas) {
    console.log("test1");
}

function test2(nodes: NodesCanvas) {
    console.log("test2");
}

function test3(nodes: NodesCanvas) {
    console.log("test3");
}