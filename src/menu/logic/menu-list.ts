import { Compose, Element } from "../../html/util";
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

    render() : Node {
        return Compose.html`
        <li>
            <a>
                <span class="icon"><my-icon-save></my-icon-save></span>
                ${Element.html`<span class="fill">${this.name}</span>`}
                <span class="icon right">➤</span>
            </a>
            <ul>
                ${this.items.map((action) => action.render())}
            </ul>
        </li>
        `;
    }
}