import {Vector2} from "../../../engine/src/lib";

/**
 * 2d camera for ctx context
 */
export class Camera2 {
    
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

}