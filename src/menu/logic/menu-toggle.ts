import { Element } from "../../html/util";
import { Key } from "../../../../engine/src/lib";
import { MenuItem } from "./menu-item";

export class MenuToggle extends MenuItem {

    active = true;
    checked = false;
    element?: HTMLElement;

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
        if (this.checked) {
            this.checked = false;
            this.onUncheck()
        } else {
            this.checked = true;
            this.onCheck()
        }
        this.update();
    }

    render() : Node {
        let keys = this.shortcut ? this.shortcut.map((k) => Key[k]).join(" + ") : ""; 
        let element = Element.html`
        <li>
            <a>
                <span id="checker" class="icon">${this.checked ? "✓" : ""}</span>
                <span class="fill">${this.name}</span>
                <span>${keys}</span>
                <span class="icon"></span>
            </a>
        </li>`

        element.onclick = () => this.do();
        this.element = element;
        return element;
    }

    update() {
        if (!this.element) return;
        let el = this.element.querySelector("#checker")!;
        el.innerHTML = this.checked ? "✓" : "";
    }
}