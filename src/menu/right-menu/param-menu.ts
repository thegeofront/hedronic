import { node } from 'webpack';
import { Element } from '../../html/util';
import { Cable } from '../../nodes-canvas/model/cable';

export function makeMenuFromCable(cable: Cable) : HTMLElement[] {

    let type = Element.html`<code>${cable.type.typeToString()}</code></p>`;

    // render state if we have state
    let nodes: HTMLElement[] = [];
    if (!cable._state) {
        return [type, ...nodes];    
    }
    let viewer: any = Element.html`<json-viewer>{}</json-viewer>`;
    
    // dont render things which are too big...
    let state = cable._state;
    if (state.length && state.length > 1000) {
        viewer.data = state.slice(0, 1000);
    } else if (typeof(state) === 'object' && Object.keys(state).length > 1000) {
        viewer.data = "[... too many properties ...]"
    } else {
        viewer.data = cable.getState();
    }

    nodes.push(viewer);
    return [type, ...nodes];
}