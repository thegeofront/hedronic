import { Catalogue } from "../../modules/catalogue";
import { ModuleShim } from "../../modules/shims/module-shim";
import { Core } from "../../nodes-canvas/model/core";
import { MenuAction } from "../logic/menu-action";
import { MenuDivider } from "../logic/menu-divider";
import { MenuItem } from "../logic/menu-item";
import { MenuList } from "../logic/menu-list";

/**
 * 
 * @returns 
 */
function getStandardLibraryMenu() {
    
    // I'm making TODO art here
    let TODO = (todo: string) => {MenuAction.new(undefined, "TODO: " + todo, () => {alert("TODO: " + todo)});}
    let TODO_CLASS = MenuAction.new(undefined, "TODO", () => {alert("TODO!")});
    let TODO_LIBRARY = MenuAction.new(undefined, "TODO", () => {alert("TODO!")});
    let TODO_SPECIAL = MenuAction.new(undefined, "TODO", () => {alert("TODO!")});
    
    let std = [
        MenuList.new("Types", [
            MenuList.new("Converters", [TODO_SPECIAL]), // we need a way of going from a vector to a point, or any {x,y,z} json to a point
        ]),
        MenuList.new("Iterate", [
            MenuList.new("Sequence", [TODO_LIBRARY]), // iterate, toIterable
            MenuList.new("Tree", [TODO_LIBRARY]), // graph, flatten
        ]), 
        MenuList.new("Data", [
            MenuList.new("List", [TODO_SPECIAL]),  
            MenuList.new("Json", [TODO_SPECIAL]),  // Get, Set
            MenuList.new("Table", [TODO_SPECIAL]), 
            MenuList.new("Map", [TODO_SPECIAL]),
        ]),
        MenuList.new("Math", [
            MenuList.new("Random", [TODO_CLASS]),
            MenuList.new("Logic", [TODO_LIBRARY]),
            MenuList.new("Basic", [TODO_LIBRARY]),
            MenuList.new("Range", [
                MenuList.new("Range-1", [TODO_CLASS]),
                MenuList.new("Range-2", [TODO_CLASS]),
                MenuList.new("Range-3", [TODO_CLASS])
            ]),
        ]),
        MenuList.new("Raster", [
            MenuList.new("Color", [TODO_CLASS]),
            MenuList.new("Bitmap", [TODO_CLASS]),
        ]),
        MenuList.new("Transform", [
            MenuList.new("Affine", [TODO_LIBRARY]),
            MenuList.new("Matrix", [TODO_CLASS]),
            MenuList.new("Quaternion", [TODO_CLASS])
        ]),
        MenuList.new("Vector 0D", [
            MenuList.new("Point", [TODO_CLASS]),
            MenuList.new("Vector", [TODO_CLASS]),
        ]),
        MenuList.new("Vector 1D", [
            MenuList.new("Line", [TODO_CLASS]),
            MenuList.new("Polyline", [TODO_CLASS]),
            MenuList.new("Nurbs Curve", [TODO_CLASS]),
        ]),
        MenuList.new("Vector 2D", [
            MenuList.new("Triangle", [TODO_CLASS]),
            MenuList.new("Polygon", [TODO_CLASS]),
            MenuList.new("Nurbs Surface", [TODO_CLASS]),
        ]),
        MenuList.new("Vector 3D", [
            MenuList.new("Mesh", [TODO_CLASS]),
            MenuList.new("Solid", [TODO_CLASS]),
        ]),
        MenuList.new("Vector Multi", [
            MenuList.new("MultiPoint", [TODO_CLASS]),
            MenuList.new("MultiVector", [TODO_CLASS]),
            MenuList.new("MultiPolyline", [TODO_CLASS]),
            MenuList.new("MultiPolygon", [TODO_CLASS]),
            MenuList.new("MultiMesh", [TODO_CLASS]),
        ]),
        MenuList.new("Misc", [
            
        ]),
    ]

    return std;
}

export function getAddActions(catalogue: Catalogue) : MenuItem[] {
    let list: MenuItem[] = [];

    // standard library
    list.push(...getStandardLibraryMenu())
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
