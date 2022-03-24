import { App, Scene, DebugRenderer, Camera, UI, MultiLine, Plane, Vector3, DrawSpeed, InputState, LineShader, InputHandler, MultiVector3, RenderableUnit, Mesh, MultiVector2, IntMatrix, Model, Material, Color } from "../../../engine/src/lib";
import { ShaderProgram } from "../../../engine/src/render/webgl/ShaderProgram";
import { PayloadEventType } from "../html/payload-event";
import { HTML } from "../html/util";
import { TypeShim } from "../modules/shims/type-shim";
import { NodesCanvas } from "../nodes-canvas/nodes-canvas";

export type VisualizePayload = {
    state: any, 
    id: string, 
    preview?: boolean
    style?: any
}

export const VisualizeEvent = new PayloadEventType<VisualizePayload>("visualizestate");

export const VisualizePreviewEvent = new PayloadEventType<NodesCanvas>("visualizepreview");

export const StopVisualizeEvent = new PayloadEventType<{id: string}>("stopvisualizestate");

export const StopVisualizePreviewEvent = new PayloadEventType<void>("stopvisualizepreview");

export class ViewerApp extends App {

    // render
    scene: Scene;
    various: DebugRenderer;
    preview: DebugRenderer;
    grid: LineShader;
    otherShaders: ShaderProgram<any>[] = [];

    constructor(gl: WebGLRenderingContext) {
        super(gl);

        let canvas = gl.canvas as HTMLCanvasElement;
        let camera = new Camera(canvas, -2, true, true);
        camera.setState([4.0424, 3.7067, -4.3147, -53.16840193074478, 1.1102909321189378,22.843839502199657]);
        this.grid = new LineShader(gl, [0.3, 0.3, 0.3, 1]);
        this.various = DebugRenderer.new(gl);
        this.preview = DebugRenderer.new(gl);
        this.scene = new Scene(camera);

        HTML.listen(VisualizeEvent, (payload) => {
            let {state, id, style} = payload;
            this.tryVisualize(id, state, style);
        })

        HTML.listen(StopVisualizeEvent, (payload) => {
            let {id} = payload;
            this.removeVisualize(id);
        })

        HTML.listen(VisualizePreviewEvent, this.setPreview.bind(this));
        HTML.listen(StopVisualizePreviewEvent, this.clearPreview.bind(this));
    }

    async start() {
        this.startGrid();  
    }

    tryVisualize(id: string, item: any, style?: any) {
        let unit = tryConvert(item, style);
        if (unit) {
            this.various.set(unit);
        }
    }

    removeVisualize(id: string) {
        this.various.delete(id);
    }

    setPreview(canvas: NodesCanvas) {
        this.preview.clear();
        let outputs = canvas.getSelectedOutputs();
        for (let output of outputs) {
            let data = canvas.tryGetCache(output);
            if (!data) continue;
            let units = tryConvert(data);
            if (!units) continue;
            this.preview.set(units, output.toString())
        }
    }

    clearPreview() {
        this.preview.clear();
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
        this.various.render(this.scene);
        this.preview.render(this.scene);
    }
}


/**
 * Try to convert a general type to a type we can render
 * Uses REFLECTION and DUMB TRUST to figure out what it is. 
 * TODO we could do this waaaay easier based on the DATUM SHIM, if we implement such a thing...
 */
function tryConvert(item: any, style?: any) : RenderableUnit | undefined {

    if (typeof item !== 'object' || item === null) return undefined;
    
    //@ts-ignore
    let typename = item.constructor.name;
    
    if (typename == "Vector" || typename == "Vector3" || (item.x != undefined && item.y != undefined && item.z != undefined)) 
        return MultiVector3.fromData([item.x, item.y, item.z]);
    if (typename == "Line" || typename == "Line3") 
        return MultiLine.fromLines(MultiVector3.fromData([item.a.x, item.a.y, item.a.z, item.b.x, item.b.y, item.b.z]));

    
    let trait = item.trait || item.type;

    if (trait == undefined) return;

    if (trait == "mesh-2") {
        const {vertices, triangles} = item;
        const color = Color.fromHex(style) || Color.fromHSL(Math.random());
        let mesh = Mesh.new(MultiVector2.fromData(vertices).to3D(), IntMatrix.fromList(triangles, 3));
        let mat = Material.fromFlatColor(color);
        let model = Model.new(mesh, mat);
        return model.spawn();
    }

    if (trait == "multi-vector-3") 
        return MultiVector3.fromData(item.buffer); 

    if (trait == "multi-line-3") 
        return MultiLine.new(item.vertices, item.edges); 

    if (trait == "mesh") 
        return Mesh.new(MultiVector3.fromData(item.vertices), item.triangles); 

    if (typename == "Array") {
        return tryConvertArray(item as Array<any>)
    }

    return undefined;
}

function tryConvertArray(item: Array<any>) : RenderableUnit | undefined {
    
    let list = [];
    for (let i = 0 ; i < item.length; i++) {
        let valueData = tryConvert(item[i]);
        if (valueData) {
            list.push(valueData);
        } 
    }

    // aggregate the data, we don't want hundreds of shaders being instanciated...
    if (list[0] instanceof MultiVector3) {
        return MultiVector3.fromJoin(list as MultiVector3[]);
    }

    // TODO allow for other things!!!
    return undefined;
}