import {Domain, InputState, Vector2} from "../../../engine/src/lib";
import { CTX } from "../nodes/nodes-core";

/**
 * 2d camera for ctx context
 */
export class Camera2 {
    
    private scaleRange = Domain.new(0.3, 5)
    public onClick?: (c: Vector2) => void;

    private constructor(
        private html_canvas: HTMLCanvasElement,
        public position: Vector2, 
        public scale: number) {}

    static new(
        html_canvas: HTMLCanvasElement, 
        startPos: Vector2, 
        startScale: number) {
        return new Camera2(html_canvas, startPos, startScale);
    }

    log() {
        console.log(`camera pos: ${this.position} scale: ${this.scale}`);
    }

    update(state: InputState) : boolean {
        let redraw = false;
        
        if (state.IsKeyPressed(" ")) {
            console.log("QQQ");
            this.log();
        }

        // clicking 
        if (state.mouseLeftPressed && this.onClick) {
            this.onClick(this.screenToWorld(state.mousePos));
        }

        // panning
        if (state.mouseRightDown) {
            this.position.sub(state.mouseDelta);
            redraw = true;
        }
      
        // zooming [JF] Lets leave this for later... 
        if (state.mouseScrollDelta != 0) {

            // let zoompoint = this.getCenter();
            // let world1 = this.screenToWorld(zoompoint);
            // this.scale = this.scaleRange.comform(this.scale * (1 - state.mouseScrollDelta));
            // // calculate the new top-left point

            // // thanks to zoomchange, this is now different
            // let world2 = this.screenToWorld(zoompoint);
            // let diff = world2.sub(world1);
            // // this.position.add(diff);


            // this.position = this.position.lerp(zoompoint, scalar / 2);

            redraw = true;
        }

        return redraw;
    }

    screenToWorld(sv: Vector2) {
        sv = sv.clone();

        // translate
        sv.add(this.position);

        // scale
        return sv.scaled(1/this.scale);
    }

    worldToScreen(wv: Vector2) {
        // inv-scale
        wv = wv.clone();
        
        wv.scale(this.scale)
        // inv-translate
        return wv.sub(this.position)
    }

    getCenter() {
        let width = this.html_canvas.width;
        let height = this.html_canvas.height;
        return this.position.clone().addn(width / 2, height / 2);
    }

    moveCtxToState(ctx: CTX) {
        ctx.translate(-this.position.x, -this.position.y)
        ctx.scale(this.scale, this.scale);
    }
}