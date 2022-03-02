import { createModuleDeclaration } from "typescript";
import { App, Scene, DebugRenderer, Camera, UI, MultiLine, Plane, Vector3, DrawSpeed, InputState, LineShader, InputHandler, MultiVector3 } from "../../../engine/src/lib";

export class TemplateApp extends App {

    // render
    scene: Scene;
    debug: DebugRenderer;
    grid: LineShader;
    

    constructor(gl: WebGLRenderingContext) {
        super(gl);

        let canvas = gl.canvas as HTMLCanvasElement;
        let camera = new Camera(canvas, -2, true);
        camera.setState([0.0000, 0.0000, 0.0000, -297.8023467558876, 1.07598230397687,14.463674887946102]);
        this.grid = new LineShader(gl, [0.3, 0.3, 0.3, 1]);
        this.debug = DebugRenderer.new(gl);
        this.scene = new Scene(camera);

        // init some state
    }

    async start() {
        this.startGrid();
        // this.debug.set(MultiVector3.fromData([1,2,3]));
        // fill some state | fill up shaders
    
    }

    ui(ui: UI) {}

    startGrid() {
        let grid = MultiLine.fromGrid(Plane.WorldXY().moveTo(new Vector3(0, 0, 0)), 100, 2);
        this.grid.set(grid, DrawSpeed.StaticDraw);
    }

    update(input: InputHandler) {
        this.scene.camera.update(input);
        // update state | fill up shaders
    }

    draw() {
        this.grid.render(this.scene);
        this.debug.render(this.scene);
    }
}
