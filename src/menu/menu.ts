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
import { getNodesActions } from "./actions/nodes";
import { getAddActions } from "./actions/add";
import { getSettingsActions } from "./actions/settings";


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
            MenuList.new("Add", getAddActions(nodesCanvas.catalogue)),
            MenuList.new("Nodes", getNodesActions(nodesCanvas)),
            MenuList.new("View", getViewActions(nodesCanvas)),
            MenuList.new("Settings", getSettingsActions(nodesCanvas))
        ]);
        return new Menu(nodesCanvas, actions);
    }

    bindEventListeners(context: HTMLCanvasElement) {
        
        // for now, listen on a global level 
        document.addEventListener("keydown", this.onGlobalKeyDown.bind(this), false);
        // dont know why i said this, global level Enter is not good
        context.addEventListener("keydown", this.onKeyDown.bind(this), false);
        
        // add this message to make users reconsider saving
        // dont do this while debugging, gets annoying real quick
        // window.onbeforeunload = function() {
        //     return true;
        // };
    }

    onGlobalKeyDown(e: KeyboardEvent) {
        let control = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey);
        let shift = e.shiftKey;      
        let key = e.key.toLowerCase(); 
        let code = e.keyCode; 

        // TODO hookup certain things like Ctrl + S, 
        // TODO disable other things like Ctrl + P
    }

    /**
     * Check all registered shortcuts, and fire the appropriate action or toggle
     */
    onKeyDown(e: KeyboardEvent) {
  
        let control = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey);
        let shift = e.shiftKey;      
        let key = e.key.toLowerCase(); 
        let code = e.keyCode; 

        // none of that quitting, printing, or other unexpected behaviour
        // however, we DO want the copy / paste behaviour to be 'normal';
        // on another note: we can also just do this ourselves
        if (control && ((code != Key.X) && (code != Key.C) && (code != Key.V))) {
            e.preventDefault();
        }

        // ignore shortcut system
        if (code == Key.Ctrl || code == Key.Shift) return;

        // figure out if the action is pressed 
        let item = this.forEachRecursiveMenuItem<MenuAction<any> | MenuToggle>((item) => {
            if (!(item instanceof MenuToggle) && !(item instanceof MenuAction)) return;
            if (!item.shortcut) return;
            let keys = item.shortcut;
            if (!perfectMatch(keys, control, shift, code)) return;
            return item;
        })
        
        if (!item) return

        // do not prevent default for these three, they are handled separately, 
        // but we still want them to show up at the menu
        if (item.name == "Cut" || item.name == "Copy" || item.name == "Paste") {
            item.do();
            return;
        }

        // do something with the item
        // console.log(item.shortcut!.map(k => Key[k]), "was pressed");
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

function perfectMatch(shortcut: Key[], control: boolean, shift: boolean, key: number) {
    
    if (control && !shortcut.includes(Key.Ctrl)) return false;
    if (shift && !shortcut.includes(Key.Shift)) return false;
    if (shortcut.includes(Key.Ctrl) && !control) return false;
    if (shortcut.includes(Key.Shift) && !shift) return false;
    if (!shortcut.includes(key)) return false;

    return true;
    

    if (!shortcut.includes(key)) return;
    return false;
}