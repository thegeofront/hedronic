import { Catalogue, Core } from "../../modules/catalogue";
import { ModuleShim } from "../../modules/shims/module-shim";
import { MenuAction } from "../logic/menu-action";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";

export function getAddActions(catalogue: Catalogue) : MenuItem[] {
    
    let list: MenuItem[] = [];

    for (let [name, module] of catalogue.modules) {
        let sublist: MenuItem[] = [];
        
        for (let core of module.widgets) {
            sublist.push(MenuAction.new({catalogue, core}, core.nameLower, make))
        }

        for (let core of module.blueprints) {
            sublist.push(MenuAction.new({catalogue, core}, core.nameLower, make))
        }

        list.push(MenuList.new(name, sublist));
    }
    
    return list;
}

export function make(context: {catalogue: Catalogue, core: Core}) {
    console.log("make");
    let {catalogue, core} = context;
    catalogue.selectCore(core);
}
