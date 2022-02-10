import { Vector2 } from "../../../engine/src/lib";
import { Operation } from "./operation";
import { Widget } from "./widget";
import { SocketIdx } from "./socket";
import { State } from "./state";
import { mapFromJson, mapToJson } from "../util/serializable";
import { CoreType } from "../operations/catalogue";

export const NODE_WIDTH = 4;

export class GeonNode {

    errorState = "";

    private constructor(
        public position: Vector2, 
        public core: Operation | Widget, // slot for an operation
        public connections: Map<SocketIdx, string>) {}

    static new(gridpos: Vector2, core: Operation | Widget, map = new Map()) {
        if (core instanceof Widget) {
            core = core.clone(); // Widgets contain unique state, while Operations are prototypes 
        }
        return new GeonNode(gridpos, core, map);
    }

    static fromJson(data: any, core: Operation | Widget) {

        let con = new Map<SocketIdx, string>();
        for (let k in data.connections) {
            con.set(Number(k), data.connections[k]);
        }
        return GeonNode.new(Vector2.new(data.position.x, data.position.y), core, con);
    }

    static toJson(node: GeonNode) {
        return {
            position: {
                x: node.position.x,
                y: node.position.y,
            },
            type: node.type,
            core: node.core.toJson(),
            connections: mapToJson(node.connections, (s: string) => {return s })
        }
    }

    run(args: State[]) {
        return this.core.run(args);
    }

    log() {
        console.log(`node at ${this.position}`);
        // this.operation.name
        console.log("operation: ")
        this.core.log();
    }

    // ---- Getters

    get operation() : Operation | undefined {
        if (this.core instanceof Operation) {
            return this.core as Operation
        } else {
            return undefined;
        }
    }

    get widget() : Widget | undefined {
        if (this.core instanceof Widget) {
            return this.core as Widget
        } else {
            return undefined;
        }
    }

    get type() : CoreType {
        if (this.core instanceof Widget) {
            return CoreType.Widget
        } else {
            return CoreType.Operation
        }
    }

    getHeight() {
        if (this.type == CoreType.Widget) {
            return this.widget!.size.y;
        } else {
            return Math.max(2, this.core.inputs, this.core.outputs);
        }
    }

    outputs() : string[] {
        let count = this.core.outputs;
        let cables: string[] = [];
        for (let i = 0; i < count; i++) {
            let cable = this.connections.get(i+1);
            if (cable)
                cables.push(cable);
        }
        return cables;
    }

    inputs() : string[] {
        let count = this.core.inputs;
        let cables: string[] = [];
        for (let i = 0; i < count; i++) {
            let cable = this.connections.get(-(i+1));
            if (cable)
                cables.push(cable);
        }
        return cables;
    }

    // ---- Selection Management

    getConnectorGridPosition(c: SocketIdx) {
        let gp = this.GetComponentLocalGridPosition(c); 
        if (gp === undefined) {
            return undefined;
        }
        return this.position.added(gp);
    }

    GetComponentLocalGridPosition(c: SocketIdx) {
        
        if (c + 1 > -this.core.inputs && c < 0) {
            // input
            let input = (c * -1) - 1;
            return Vector2.new(0, input);
        } else if (c > 0 && c-1 < this.core.outputs) {
            // output 
            let output = c - 1;
            return Vector2.new(NODE_WIDTH-1, output);
        } else {
            return undefined;
        }
    }

    trySelect(gp: Vector2) : number | undefined {
        let height = this.getHeight();
        let local = gp.subbed(this.position);

        // check if we select the widget
        if (this.core instanceof Widget) {
            let result = this.core.trySelect(local);
            if (result) {
                return result;
            }
        }

        // see if this vector lands on an input socket, an output socket, or the body
        if (local.y < 0 || local.y >= height) {
            // quickly return if we dont even come close
            return undefined;
        } else if (local.x == 0) {
            if (local.y < this.core.inputs) {
                return -(local.y + 1) // selected input
            } else {
                return 0; // selected body
            }
        } else if (local.x > 0 && local.x < NODE_WIDTH-1) {
            return 0; // selected body
        } else if (local.x == NODE_WIDTH-1) {
            if (local.y < this.core.outputs) {
                return local.y + 1 // selected output
            } else {
                return 0; // selected body
            }
        }
        return undefined;
    }
}
