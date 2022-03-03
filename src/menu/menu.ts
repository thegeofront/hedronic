import { FileActions } from "./file";
import { MenuAction } from "./action";

export class Menu {

    private constructor(
        public actions = new Map<string, MenuAction[]>(),
    ) {}

    static newDefault() {
        let actions = new Map();
        actions.set("File", FileActions);
        actions.set("Edit", []);
        actions.set("Add", []);
        actions.set("View", []);
        actions.set("Help", []);

        return new Menu(actions);
    }

}