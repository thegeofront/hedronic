import { node } from 'webpack';
import { Element } from '../../html/util';
import { Cable } from '../../nodes-canvas/model/cable';

export function makeMenuFromCable(cable: Cable) : HTMLElement[] {
    let nodes: HTMLElement[] = [];
    if (cable.state) {
        let viewer: any = Element.html`<json-viewer>{}</json-viewer>`;
        viewer.data = cable.state;
        nodes.push(viewer);
    }
    return nodes;
}