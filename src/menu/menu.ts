import { getFileActions } from "./actions/file";
import { getViewActions } from "./actions/view";
import { getEditActions } from "./actions/edit";
import { MenuList } from "./logic/menu-list";
import { NodesCanvas } from "../nodes-canvas/nodes-canvas";
import { MenuDivider } from "./logic/menu-divider";
import { MenuItem } from "./logic/menu-item";
import { Compose, Element } from "../html/util";
import { MenuAction } from "./logic/menu-action";
import { MenuToggle } from "./logic/menu-toggle";
import { Key } from "../../../engine/src/lib";


export class Menu {

    private constructor(
        public nodes: NodesCanvas,
        public actions: MenuList,
        // public settings: MenuList
        // public contextual: MenuList
    ) {
    }

    static newDefault(nodesCanvas: NodesCanvas) {
        let actions = MenuList.new("Actions", [
            MenuList.new("File", getFileActions(nodesCanvas)),
            MenuList.new("Edit", getEditActions(nodesCanvas)),
            MenuList.new("Add", getFileActions(nodesCanvas)),
            MenuList.new("View", getViewActions(nodesCanvas)),
            MenuList.new("Help", getFileActions(nodesCanvas))
        ]);
        return new Menu(nodesCanvas, actions);
    }

    bindEventListeners(context: HTMLElement) {

        context.addEventListener("keydown", this.onKeyDown.bind(this), false);

        // to special things with Ctrl + C and Ctrl + V, we need access to the clipboard using these specific events...
        document.addEventListener("cut", this.onCut.bind(this));
        document.addEventListener("copy", this.onCopy.bind(this));
        document.addEventListener("paste", this.onPaste.bind(this));
        
        // add this message to make users reconsider saving
        // window.onbeforeunload = function() {
        //     return true;
        // };
    }

    onCut(e: ClipboardEvent) {
        console.log("cut");
        e.clipboardData!.setData("text/plain", this.nodes.onCut());
        e.preventDefault();
    }

    onCopy(e: ClipboardEvent) {
        console.log("copy")
        e.clipboardData!.setData("text/plain", this.nodes.onCopy());
        e.preventDefault();
    }

    onPaste(e: ClipboardEvent) {
        console.log("paste")
        if (!e.clipboardData) {
            // alert("I would like a string, please");
            return;
        }
        if (e.clipboardData.items.length != 1) {
            // alert("I would like just one string, please");
            return;
        }
        e.clipboardData.items[0].getAsString((pastedString: string) => {
            this.nodes.onPaste(pastedString);
        });
    }

    onKeyDown(e: KeyboardEvent) {
  
        let control = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey);
        let shift = e.shiftKey;      
        let key = e.key.toLowerCase(); 
        let code = e.keyCode; 

        // none of that quitting, printing, or other unexpected behaviour
        if (control) {
            e.preventDefault();
        }

        // we handle these separately
        if (code == Key.Ctrl || code == Key.Shift) return;

        // figure out if the action is pressed 
        let item = this.forEachRecursiveMenuItem<MenuAction<any> | MenuToggle>((item) => {
            if (!(item instanceof MenuToggle) && !(item instanceof MenuAction)) return;
            if (!item.shortcut) return;
            let keys = item.shortcut;
            if (keys.includes(Key.Ctrl) && !control) return;
            if (keys.includes(Key.Shift) && !shift) return;
            if (!keys.includes(code)) return;
            return item;
        })
        
        if (!item) return

        // do not prevent default for these three, they are handled separately, 
        // but we still want them to show up at the menu
        if (item.name == "Cut" || item.name == "Copy" || item.name == "Paste") {
            return;
        }

        // do something with the item
        console.log(item.shortcut!.map(k => Key[k]), "was pressed");
        item.do();
        e.preventDefault();
    }

    forEachRecursiveMenuItem<T>(callback: (item: MenuItem) => T | undefined, list = this.actions) : T | undefined {
        for (let item of list.items) {
            if (callback(item)) {
                return callback(item);
            }
            if (item instanceof MenuList) {
                let res = this.forEachRecursiveMenuItem(callback, item);
                if (res) return res;
            }
        }
        return undefined;
    }

    render() {
        return this.actions.items.map(c => {
            let cat = c as MenuList
            return Compose.html`
            <my-dropdown-button>
                ${Element.html`<span slot="title">${cat.name}</span>`}
                <ul slot="list">
                    ${cat.items.map((action) => action.render())}
                </ul>
            </my-dropdown-button>`
        });
    }
}