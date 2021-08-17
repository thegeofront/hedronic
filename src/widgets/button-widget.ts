import { Domain2, Vector2 } from "../../../engine/src/lib";
import { State } from "../graph/state";
import { Widget, WidgetSide } from "../graph/widget";
import { NodesCanvas } from "../nodes/nodes-canvas";

export class ButtonWidget extends Widget {
    
    // we must copy-paste `new` and `clone` to make sure the type stays consistent

    static new(name: string, side: WidgetSide, state?: State, size?: Vector2) {

        // sry for this dumb code
        let rec;
        if (!size) {
            if (side == WidgetSide.Input) {
                rec = Domain2.fromWH(0,0,1,1);
            } else {
                rec = Domain2.fromWH(2,0,1,1);
            }
        } else {
            if (side == WidgetSide.Input) {
                rec = Domain2.fromWH(-(size.x-1), 0, size.x, size.y);
            } else {
                rec = Domain2.fromWH(2, 0, size.x, size.y);
            }
        }
    
        return new ButtonWidget(
            name, 
            side == WidgetSide.Input ? 0 : 1, 
            side == WidgetSide.Output ? 0 : 1, 
            side,
            rec,
            state ? state : false,
            );
    }

    clone() {
        return ButtonWidget.new(this.name, this.side, this.state, this.bounds.size());
    }

    onClick(canvas: NodesCanvas) {
        this.state = !this.state;
        canvas.deselectSocket();
        canvas.graph.calculate();
    }
}