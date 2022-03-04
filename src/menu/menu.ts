import { MenuAction } from "./items/menu-action";
import { FileActions } from "./categories/file";
import { MenuItem } from "./items/menu-item";


export class Menu {

    private constructor(
        public categories = new Map<string, MenuItem[]>(),
    ) {}

    static newDefault() {
        let categories = new Map();
        categories.set("File", FileActions);

        categories.set("Edit", []);

        categories.set("Add", []);

        categories.set("View", []);

        categories.set("Help", []);

        return new Menu(categories);
    }

}