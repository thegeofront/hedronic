import { Catalogue } from "../../modules/catalogue";
import { ModuleShim } from "../../modules/shims/module-shim";
import { Core } from "../../nodes-canvas/model/core";
import { STD } from "../../std/std";
import { MenuAction } from "../logic/menu-action";
import { MenuDivider } from "../logic/menu-divider";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";

export function getAddActions(catalogue: Catalogue) : MenuItem[] {
    let list: MenuItem[] = [];

    // standard library
    let std = STD.default(); // TODO move this to catalogue
    let additions = std.toMenu(catalogue);
    list.push(...additions);
    list.push(MenuDivider.new());

    for (let [name, module] of catalogue.modules) {
        list.push(MenuList.new(name, makeSublist(catalogue, module)));
    }
    return list;
}

function makeSublist(catalogue: Catalogue, module: ModuleShim) {
    let list: MenuItem[] = [];
    
    let sublists = new Map<string, MenuList>();
    for (let core of module.widgets) {
        list.push(makeMenuAction(catalogue, core))
    }

    for (let core of module.blueprints) {
        
        if (core.path!.length > 2) {

            // group class methods & constructors together
            let subname = core.path![1];
            if (!sublists.has(subname)) {
                let classlist = MenuList.new(subname, []);
                sublists.set(subname, classlist);
                list.push(classlist); 
            } 

            let classlist = sublists.get(subname);
            classlist?.items.push(makeMenuAction(catalogue, core))
            
        } else {
            list.push(makeMenuAction(catalogue, core))
        }
    }

    return list;
}

/**
 * Create a menu action which selects a core
 */
export function makeMenuAction(catalogue: Catalogue, core: Core, name?: string) {
    let maker = (context: {cat: Catalogue, c: Core}) => {
        let {cat, c} = context;
        cat.selectCore(c);
    }
    return MenuAction.new({cat: catalogue, c: core}, name || core.nameLower, maker);
}

