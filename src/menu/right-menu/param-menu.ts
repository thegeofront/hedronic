import { node } from 'webpack';
import { Element } from '../../html/util';
import { Cable } from '../../nodes-canvas/model/cable';

export function makeMenuFromCable(cable: Cable) : HTMLElement[] {

    let type = Element.html`<code>${cable.type.typeToString()}</code></p>`;

    // render state if we have state
    let nodes: HTMLElement[] = [];
    if (cable.state) {
        let viewer: any = Element.html`<json-viewer>{}</json-viewer>`;
        viewer.data = cable.state;
        nodes.push(viewer);
    }

    return [type, ...nodes];
}