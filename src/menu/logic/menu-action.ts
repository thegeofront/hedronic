import { Key } from "../../../../engine/src/lib";
import { Element } from "../../html/util";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { MenuItem } from "./menu-item";

export class MenuAction<T> extends MenuItem {

    active = true;

    constructor(
        public name: string,
        public context: T,
        public action: (context: T) => void,
        public shortcut?: Key[],
        ) {
            super();
        }   
    
    static new<T>(
        context: T,
        name: string,
        action: (context: T) => void,
        shortcut?: Key[],
        ) {
        return new MenuAction(name, context, action, shortcut);
    }

    do() {
        this.action(this.context);
    }

    render() : Node {
        let keys = this.shortcut ? this.shortcut.map((k) => Key[k]).join(" + ") : ""; 
        let element = Element.html`
        <li>
            <a onclick="">
                <span class="icon">${""}</span>
                <span class="fill">${this.name}</span>
                <span>${keys}</span>
                <span class="icon"></span>
            </a>
        </li>`

        element.onclick = () => this.do();
        return element;
    }
}