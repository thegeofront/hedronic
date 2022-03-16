import { Element, Str } from "../../html/util";
import { TypeShim } from "../../modules/shims/type-shim";
import { Trait } from "../../modules/types/trait";
import { GeonNode } from "../../nodes-canvas/model/node";
import { Socket, SocketSide } from "../../nodes-canvas/model/socket";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";

export function makeMenuFromNode(payload: {node: GeonNode, nodes: NodesCanvas}) : Node[] {
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

    return [Element.html`
        <div id="node-menu">
            <p>name: <code>${title}</code></p>
            <p>path: <code>${subtitle}</code></p>
            <p>hash: <code>${node.hash}</code></p>
            <!-- <div class="row">
                <p class="col">inputs: <code>${ops?.inCount}</code></p>
                <p class="col">outputs: <code>${ops?.outCount}</code></p>
            </div> -->
            <div class="divider"></div>
            <h5>Process</h5>
            <p>took: <code>${"???"}</code>ms</p>
            <div class="divider"></div>
            <h5>Inputs</h5>
            ${inputHTML}
            <div class="divider"></div>
            <h5>Outputs</h5>
            ${outputHTML}
            <div class="divider"></div>
        </div>
    `];
}