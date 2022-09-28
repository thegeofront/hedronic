import { App, Scene, DebugRenderer, Camera, UI, MultiLine, Plane, Vector3, DrawSpeed, InputState, LineShader, InputHandler, MultiVector3, RenderableUnit, Mesh, MultiVector2, IntMatrix, Model, Material, Color, Entity, Key, Debug } from "../../../engine/src/lib";
import { ShaderProgram } from "../../../engine/src/render/webgl/ShaderProgram";
import { PayloadEventType } from "../html/payload-event";
import { HTML } from "../html/util";
import { PluginConversion } from "../modules/types/rust-conversion";
import { GeoShaderType } from "../modules/types/type";
import { NodesCanvas } from "../nodes-canvas/nodes-canvas";
import { Point } from "../std/functions/v0/point";

export type VisualizePayload = {
    state: any, 
    id: string, 
    preview?: boolean
    style?: any
}

export const MoveCameraToEvent = new PayloadEventType<{pos: Vector3, a: number, b: number}>("movecamera");

export const VisualizeEvent = new PayloadEventType<VisualizePayload>("visualizestate");

export const VisualizePreviewEvent = new PayloadEventType<NodesCanvas>("visualizepreview");

export const StopVisualizeEvent = new PayloadEventType<{id: string}>("stopvisualizestate");

export const StopVisualizePreviewEvent = new PayloadEventType<void>("stopvisualizepreview");

export class ViewerApp extends App {

    // render
    scene: Scene;

    grid: LineShader;
    otherShaders: ShaderProgram<any>[] = [];
    preview: DebugRenderer;
    viewWidgets = new Map<string, DebugRenderer>();

    constructor(gl: WebGLRenderingContext) {
        super(gl);

        let canvas = gl.canvas as HTMLCanvasElement;
        let camera = new Camera(canvas, -2, true, true);
        camera.setState([8.9038, -26.638, 17.679, -64.81615930105617, 1.0556052420711626,24.786936191871423]);
        this.grid = new LineShader(gl, [0.3, 0.3, 0.3, 1]);
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

        if (!this.viewWidgets.has(id)) {
            this.viewWidgets.set(id, DebugRenderer.new(this.gl));
        }
        let dr = this.viewWidgets.get(id)!;
        dr.clear();
        let unit = tryConvert(item, style);
        if (unit instanceof Array) {
            for (let [i, u] of unit.entries()) {
                let key = i.toString();
                dr.set(u, key, style);
            }
        } else if (unit) {
            dr.set(unit, id, style);
        }
    }

    removeVisualize(id: string) {
        if (!this.viewWidgets.has(id)) {
            Debug.warn("does not exist");
            return;
        }
        this.viewWidgets.get(id)!.clear();
        this.viewWidgets.delete(id);
    }

    setPreview(canvas: NodesCanvas) {
        this.preview.clear();
        let outputs = canvas.getSelectedOutputs();
        for (let output of outputs) {
            let data = canvas.tryGetCache(output);
            if (!data) continue;
            let units = tryConvert(data);
            if (!units) continue;
            if (units instanceof Array) {
                for (let [i, u] of units.entries()) {
                    let key = i.toString();
                    this.preview.set(u, key);
                }
            } else if (units) {
                this.preview.set(units, "preview");
            }
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
        this.preview.render(this.scene);
        for (let viewer of this.viewWidgets.values()) {
            viewer.render(this.scene);
        }
    }
}


/**
 * Try to convert a general type to a type we can render
 * Uses REFLECTION and DUMB TRUST to figure out what it is. 
 * TODO we could do this waaaay easier based on the DATUM SHIM, if we implement such a thing...
 */
function tryConvert(item: any, style?: any) : RenderableUnit | RenderableUnit[] | undefined {

    if (typeof item !== 'object' || item === null) return undefined;
    
    // first, judge based on typename (javascript type)
    
    //@ts-ignore
    let typename = item.constructor.name;

    // judge based on rust gf traits
    if (PluginConversion.isRenderable(item)) {
        let {type, buffers} = PluginConversion.getShaderAndBuffers(item)!;
        if (type == GeoShaderType.Point) {
            return MultiVector3.fromData([buffers.x, buffers.y, buffers.z]); // TODO buffer & aggregate
        } else if (type === GeoShaderType.MultiPoint) {
            return MultiVector3.fromData(buffers.verts); // TODO buffer & aggregate
        } else if (type === GeoShaderType.PointCloud) {
            return MultiVector3.fromData(buffers.verts); // TODO buffer & aggregate
        } else if (type === GeoShaderType.BoundingBox) {
            return undefined
        } else if (type === GeoShaderType.Plane) {
            // return Plane.
        } else if (type === GeoShaderType.Mesh) {
            return Mesh.new(MultiVector3.fromData(buffers.verts), IntMatrix.fromList(buffers.cells, 3)); 
        } 
        Debug.warn("type", type, "is unknown!");
        return undefined;
    }

    if (typename == "Array") 
        return tryConvertArray(item as Array<any>);

    if (typename == "Vector" || typename == "Vector3" || (item.x != undefined && item.y != undefined && item.z != undefined)) 
        return MultiVector3.fromData([item.x, item.y, item.z]);

    if (typename == "Line" || typename == "Line3") 
        return MultiLine.fromLines(MultiVector3.fromData([item.a.x, item.a.y, item.a.z, item.b.x, item.b.y, item.b.z]));


    // STD
    if (typename.includes("Mesh")) {
        return Mesh.new(
            MultiVector3.fromData(item.verts.data), 
            IntMatrix.fromList(item.faces, 3)
        );
    }

    
    // second, judge based on trait. (geofront type, just a way to flag a json)

    let trait = item.trait || item.type; // THIS IS UGLY
   
    if (trait == undefined) return;

    if (trait == "vector-2") 
        return MultiVector2.fromData([item.x, item.y]).to3D()
    

    if (trait == "mesh-2") {
        const {vertices, triangles} = item;
        const color = Color.fromHex(style) || Color.fromHSL(Math.random());
        let mesh = Mesh.new(MultiVector2.fromData(vertices).to3D(), IntMatrix.fromList(triangles, 3));
        let mat = Material.fromFlatColor(color);
        let model = Model.new(mesh, mat);
        return model.spawn();
    }

    if (trait == "mesh-3") {
        const color = (style === "" ? Color.fromHSL(Math.random()) : Color.fromHex(style)) || Color.fromHSL(Math.random());
        let mesh = item;
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

    return undefined;
}

/**
 * WE ASSUME THE LIST IS HOMOGENOUS
 */
function tryConvertArray(items: Array<any>) : RenderableUnit[] | RenderableUnit |  undefined {
    
    // console.log("trying to convert array...");

    // TODO aggregate, make a more efficient shader for rendering multiple colored meshes
    if (items[0] instanceof Point) {
        // console.log("agreggating...");
        return MultiVector3.fromList(items);
    }

    let list = [];
    for (let i = 0 ; i < items.length; i++) {
        let valueData = tryConvert(items[i]);
        if (valueData && !(valueData instanceof Array)) {
            list.push(valueData);
        } 
    }
 
    // TODO aggregate, make a more efficient shader for rendering multiple colored meshes
    if (list[0] instanceof Entity) {
        return list;
    }
    
    // aggregate the data, we don't want hundreds of shaders being instanciated...
    if (list[0] instanceof MultiVector3) {
        console.log("all entities!!!");
        console.log(list);
    }

    // TODO allow for other things!!!
    return list;
}