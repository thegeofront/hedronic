import { Vector2 } from "../../../engine/src/lib";
import { Operation } from "./operation";
import { Widget } from "./widget";
import { SocketIdx } from "./socket";

export class GeonNode {

    private constructor(
        public position: Vector2, 
        public core: Operation | Widget, // slot for an operation
        public connections: Map<SocketIdx, string>) {}

    static new(gridpos: Vector2, op: Operation) {
        return new GeonNode(gridpos, op, new Map());
    }

    static newWidget(gridPos: Vector2, widget: Widget) {
        return new GeonNode(gridPos, widget, new Map())
    }

    run(...args: boolean[]) {
        return this.core.run(...args);
    }

    log() {
        console.log(`chip at ${this.position}`);
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

    // ---- Selection

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
            return Vector2.new(2, output);
        } else {
            return undefined;
        }
    }

    trySelect(gp: Vector2) : number | undefined {
        let max = Math.max(this.core.inputs, this.core.outputs);
        let local = gp.subbed(this.position);

        // check if we select the widget
        if (this.core instanceof Widget) {
            let result = this.core.trySelect(local);
            if (result) {
                return result;
            }
        }

        // see if this vector lands on an input socket, an output socket, or the body
        if (local.y < 0 || local.y >= max) {
            // quickly return if we dont even come close
            return undefined;
        } else if (local.x == 0) {
            if (local.y < this.core.inputs) {
                return -(local.y + 1) // selected input
            } else {
                return 0; // selected body
            }
        } else if (local.x == 1) {
            return 0; // selected body
        } else if (local.x == 2) {
            if (local.y < this.core.outputs) {
                return local.y + 1 // selected output
            } else {
                return 0; // selected body
            }
        }
        return undefined;
    }

    // ---- Connection

    addConnection() {

    }

    hasConnection() {
        
    }

    removeConnection() {

    }
}
