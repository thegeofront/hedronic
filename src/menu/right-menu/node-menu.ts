import { Graph } from "../../../../engine/src/lib";
import { Compose, Element, Str } from "../../html/util";
import { TypeShim } from "../../modules/shims/type-shim";
import { NodesGraph } from "../../nodes-canvas/model/graph";
import { GeonNode } from "../../nodes-canvas/model/node";
import { Socket, SocketSide } from "../../nodes-canvas/model/socket";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { Trait } from "../../std/types/types-3";
import { MenuMaker } from "../util/menu-maker";

export function makeMenuFromNode(node: GeonNode, nodes: NodesCanvas) {

    let processHTML = Str.html`
        <p>profiler: <code>${""}</code>ms</p>
        <p>looping: <code>${node.looping.toString()}</code></p>
        ${node.looping ? Str.html`<p>loops: <code>${node.loops}</code></p>` : ""}
        ${node.errorState ? Str.html`<p>error: <code>${node.errorState}</code></p>` : ""}
    `

    let looptoggle = MenuMaker.toggle("loop", node.looping, (ev) => {
        // let target = (ev.target as HTMLInputElement).querySelector("label");
        node.toggleLooping();
        nodes.onChange();
    })

    let recalcbutton = MenuMaker.button("recalculate", () => {
        nodes.onChange();
    })

    return {processHTML, looptoggle, recalcbutton};
}

export function makeMenuFromOperation(payload: {node: GeonNode, nodes: NodesCanvas}) : Node[] {
    let {node, nodes} = payload;
    
    let title = node.core.nameLower || "-";
    let subtitle = node.operation?.path.join(".") || "widget";
    // let content = JSON.stringify(node.operation?.toJson(), null, 2);
    let ops = node.operation!;

    let makeParamEntry = (type: TypeShim, connection: string, socket?: Socket) => {
        let t = type.typeToString();
        return Str.html`
        <details>
            <summary slot="title"><b>${type.name}: </b><code>${t}</code></summary>
            <p>value: <code>${socket ? nodes.tryGetCache(socket) : ""}</code></p>
            <p>con: <code>${connection}</code></p>
            <p>traits: <code>${type.traits.map(t => Trait[t]).join()}</code></p>
        </details>
        `;
    }

    let inputHTML = ops.ins.map((type, i) => {
        let local = Socket.fromNode(node.hash, i, SocketSide.Input);
        let socket = node.inputs[i];
        let connection = socket ? `${socket.hash}[${socket.normalIndex()}]` : "Empty";
        return makeParamEntry(type, connection, local);
    }).join("");
    
    let outputHTML = ops?.outs.map((type, i) => {
        let local = Socket.fromNode(node.hash, i, SocketSide.Output);
        let sockets = node.outputs[i];
        let connection = "Empty";
        if (sockets.length != 0) {
            connection = sockets.map((s) => `${s.hash}[${s.normalIndex()}]`).join(" , ")
        }
        return makeParamEntry(type, connection, local);
    }).join("");

    if (!inputHTML || !outputHTML) {
        inputHTML = "";
        outputHTML = "";
    }

    const {processHTML, looptoggle, recalcbutton} = makeMenuFromNode(node, nodes);

    return [Element.html`
        <div id="node-menu">
            <p>name: <code>${title}</code></p>
            <p>path: <code>${subtitle}</code></p>
            <p>hash: <code>${node.hash}</code></p>
            <div class="divider"></div>
            <h5>Inputs</h5>
            ${inputHTML}
            <div class="divider"></div>
            <h5>Process</h5>
            ${processHTML}
            <div class="divider"></div>
            <h5>Outputs</h5>
            ${outputHTML}
            <div class="divider"></div>
        </div>
    `, looptoggle,
    recalcbutton];
}