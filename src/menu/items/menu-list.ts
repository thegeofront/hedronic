import { MenuItem } from "./menu-item";

export class MenuList extends MenuItem {

    constructor(
        public name: string,
        public items: MenuItem[],
    ) {
        super()
    }

    static new(name: string, items: MenuItem[]) {
        return new MenuList(name, items);
    }
}