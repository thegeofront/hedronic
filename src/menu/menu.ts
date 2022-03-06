import { MenuAction } from "./items/menu-action";
import { getFileActions } from "./categories/file";
import { MenuItem } from "./items/menu-item";
import { getViewActions } from "./categories/view";
import { getEditActions } from "./categories/edit";


export class Menu {

    private constructor(
        public categories = new Map<string, MenuItem[]>(),
    ) {}

    static newDefault() {
        let categories = new Map<string, MenuItem[]>();
        categories.set("File", getFileActions());

        categories.set("Edit", getEditActions());

        categories.set("Add", []);

        categories.set("View", getViewActions());

        categories.set("Help", []);

        return new Menu(categories);
    }

    call(a: HTMLAnchorElement) {
        console.log("message recieved!!");
        console.log(a);
    }
}