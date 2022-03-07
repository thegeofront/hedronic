import { Element } from "../../html/util";
import { MenuItem } from "./menu-item";

export class MenuDivider extends MenuItem {

    static new() {
        return new MenuDivider();
    }

    render() : Node {
        return Element.html`<div></div>`;
    }
}

// let div = Node.html`<div><a>Hallo</a></div>`;