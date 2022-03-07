import { Element } from "../../html/util";
import { Key } from "../../../../engine/src/lib";
import { MenuItem } from "./menu-item";

export class MenuToggle extends MenuItem {

    active = true;
    checked = false;

    constructor(
        public name: string,
        public onCheck: Function,
        public onUncheck: Function,
        public shortcut?: Key[],
        ) {
            super();
        }   
    
    static new(
        name: string,
        onCheck: Function,
        onUncheck: Function,
        shortcut?: Key[],
        ) {
        return new MenuToggle(name, onCheck, onUncheck, shortcut);
    }

    do() {
        if (this.active) {
            this.active = false;
            this.onUncheck()
        } else {
            this.active = true;
            this.onCheck()
        }
    }

    render() : Node {
        let keys = this.shortcut ? this.shortcut.map((k) => Key[k]).join(" + ") : ""; 
        return Element.html`
        <li>
            <a>
                <span class="icon">${this.checked ? "✓" : ""}</span>
                <span class="fill">${this.name}</span>
                <span>${keys}</span>
                <span class="icon"></span>
            </a>
        </li>`
    }
}