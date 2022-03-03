import { App, Scene, DebugRenderer, Camera, UI, MultiLine, Plane, Vector3, DrawSpeed, InputState, LineShader, InputHandler, MultiVector3, RenderableUnit, Mesh } from "../../../engine/src/lib";
import { PayloadEventType } from "../html/payload-event";
import { HTML } from "../html/util";

export const VisualizeEvent = new PayloadEventType<{state: any, id: string}>("visualizestate");

export class ViewerApp extends App {

    // render
    scene: Scene;
    debug: DebugRenderer;
    grid: LineShader;
    

    constructor(gl: WebGLRenderingContext) {
        super(gl);

        let canvas = gl.canvas as HTMLCanvasElement;
        let camera = new Camera(canvas, -2, true);
        camera.setState([4.0424, 3.7067, -4.3147, -53.16840193074478, 1.1102909321189378,22.843839502199657]);
        this.grid = new LineShader(gl, [0.3, 0.3, 0.3, 1]);
        this.debug = DebugRenderer.new(gl);
        this.scene = new Scene(camera);

        HTML.listen(VisualizeEvent, (payload) => {
            console.log(payload);
            let {state, id} = payload;
            this.tryVisualize(id, state);
        })
    }

    async start() {
        this.startGrid();
        // this.debug.set(MultiVector3.fromData([1,2,3]));
        // fill some state | fill up shaders    
    }

    tryVisualize(id: string, item: any) {
        console.log("visualize something:", id, item);
        let unit = tryConvert(item);
        if (unit) {
            this.debug.set(unit, id);
        }
    }

    startGrid() {
        let grid = MultiLine.fromGrid(Plane.WorldXY().moveTo(new Vector3(0, 0, 0)), 100, 2);
        this.grid.set(grid, DrawSpeed.StaticDraw);
    }

    update(input: InputHandler) {
        this.scene.camera.update(input);
    }

    draw() {
        this.grid.render(this.scene);
        this.debug.render(this.scene);
    }
}


/**
 * Try to convert a general type to a type we can render
 */
function tryConvert(item: any) : RenderableUnit | undefined {
    if (typeof item !== 'object' || item === null) return undefined;
    
    //@ts-ignore
    let typename = item.constructor.name;
    console.log(typename);

    if (typename == "Vector") return MultiVector3.fromData([item.x, item.y, item.z]);
    if (typename == "Line") return MultiLine.fromLines(MultiVector3.fromData([item.a.x, item.a.y, item.a.z, item.b.x, item.b.y, item.b.z]));
    if (typename == "Sphere") return Mesh.newSphere(item.center, item.radius, 10, 10);
    
    return undefined;
}