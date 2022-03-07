import { MenuAction } from "./logic/menu-action";
import { getFileActions } from "./categories/file";
import { MenuItem } from "./logic/menu-item";
import { getViewActions } from "./categories/view";
import { getEditActions } from "./categories/edit";
import { MenuList } from "./logic/menu-list";
import { NodesCanvas } from "../nodes-canvas/nodes-canvas";


export class Menu {

    private constructor(
        public categories: MenuList[] = [],
    ) {}

    static newDefault(nodesCanvas: NodesCanvas) {
        let categories: MenuList[] = [];
        categories.push(MenuList.new("File", getFileActions(nodesCanvas)));
        categories.push(MenuList.new("Edit", getEditActions(nodesCanvas)));
        categories.push(MenuList.new("Add", getFileActions(nodesCanvas)));
        categories.push(MenuList.new("View", getViewActions(nodesCanvas)));
        categories.push(MenuList.new("Help", getFileActions(nodesCanvas)));
        return new Menu(categories);
    }
}