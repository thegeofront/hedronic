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
            MenuAction.new(context, "Print catalogue", print, [Key.Ctrl, Key.K]),
            MenuAction.new(context, "Check connections", checkConnections, [Key.Ctrl, Key.I]),
            MenuAction.new(context, "Print types", printTypes, [Key.Ctrl, Key.U]),
            MenuAction.new(context, "Test 3", test3),
        ])
    ];
} 

function prompt(nodes: NodesCanvas) {
    nodes.promptForNode(nodes.mgpHover);
}

function print(nodes: NodesCanvas) {
    nodes.catalogue.print();
}

function checkConnections(nodes: NodesCanvas) {
    try {
        let check = nodes.graph.areConnectionsCorrect();
        if (check) {
            console.log("Correct!");
        } else {
            console.warn("Incorrect connections!");
        }
    } catch(e: any) {
        console.warn("Not at all correct: ");
        console.error(e);
    }
 
}

function printTypes(nodes: NodesCanvas) {
    console.log(nodes.catalogue.types);
}

function test3(nodes: NodesCanvas) {
    console.log("test3");
}