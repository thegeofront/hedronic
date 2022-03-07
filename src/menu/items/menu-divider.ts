import { Node } from "../../html/util";
import { MenuItem } from "./menu-item";

export class MenuDivider extends MenuItem {

    static new() {
        return new MenuDivider();
    }

    render() : Node {
        return Node.html`<div></div>`;
    }
}