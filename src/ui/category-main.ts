import { DomWriter } from "../util/dom-writer";
import { MenuContent } from "./category";

export class MenuContentMain implements MenuContent {
    
    constructor() {
        
    }
    
    render(dom: DomWriter): void {
        dom.addDiv("text-white")
            dom.addText("New").up();
            dom.addText("Load").up();
            dom.addText("Save").up();
            dom.addText("Export").up();
        dom.up()
    }

}