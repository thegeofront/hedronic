use serde::{Serialize, Deserialize};
use wasm_bindgen::prelude::wasm_bindgen;

// order is important!
#[wasm_bindgen]
pub enum GeoShaderType {
    Point=0,
    MultiPoint=1,
    PointCloud=2,
    BoundingBox=3,
    Plane=4,
    Mesh=5,
}

#[derive(Serialize, Deserialize)]
pub struct PointBuffer {
    pub x: f64,
    pub y: f64,
    pub z: f64,
}

#[derive(Serialize, Deserialize)]
pub struct MultiPointBuffer {
    pub verts: Vec<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct PointCloudBuffer {
    pub verts: Vec<f64>,  // (x, y, z)
    pub colors: Vec<f64>, // (r, g, b, a)
}

#[derive(Serialize, Deserialize)]
pub struct BoundingBoxBuffer {
    pub a: PointBuffer,  // (x, y, z)
    pub b: PointBuffer,  // (x, y, z)
}

#[derive(Serialize, Deserialize)]
pub struct PlaneBuffer {
    pub a: f64,  // (x, y, z)
    pub b: f64,  // (x, y, z)
    pub c: f64,  // (x, y, z)
    pub d: f64,  // (x, y, z)
}

#[derive(Serialize, Deserialize)]
pub struct MeshBuffer {
    pub verts: Vec<f64>,
    pub cells: Vec<usize>,
}
