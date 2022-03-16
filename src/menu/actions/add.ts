import { Catalogue } from "../../modules/catalogue";
import { ModuleShim } from "../../modules/shims/module-shim";
import { Core } from "../../nodes-canvas/model/core";
import { MenuAction } from "../logic/menu-action";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";

export function getAddActions(catalogue: Catalogue) : MenuItem[] {
    let list: MenuItem[] = [];
    for (let [name, module] of catalogue.modules) {
        list.push(MenuList.new(name, makeSublist(catalogue, module)));
    }
    return list;
}

function makeSublist(catalogue: Catalogue, module: ModuleShim) {
    let list: MenuItem[] = [];
    
    let sublists = new Map<string, MenuList>();
    for (let core of module.widgets) {
        list.push(MenuAction.new({catalogue, core}, core.nameLower, make))
    }

    for (let core of module.blueprints) {

        
        if (core.path.length > 2) {

            // group class methods & constructors together
            let subname = core.path[1];
            if (!sublists.has(subname)) {
                let classlist = MenuList.new(subname, []);
                sublists.set(subname, classlist);
                list.push(classlist); 
            } 

            let classlist = sublists.get(subname);
            classlist?.items.push(MenuAction.new({catalogue, core}, core.nameLower, make))
            
        } else {
            list.push(MenuAction.new({catalogue, core}, core.nameLower, make))
        }
    }

    
    return list;
}

export function make(context: {catalogue: Catalogue, core: Core}) {
    console.log("make");
    let {catalogue, core} = context;
    catalogue.selectCore(core);
}
