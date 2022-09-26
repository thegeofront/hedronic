mod shader_buffers;
mod wasm_util;

pub use shader_buffers::*;
pub use wasm_util::*;


use wasm_bindgen::prelude::wasm_bindgen;

// the geofront type
#[wasm_bindgen]
pub enum GeoType {
    Void,
    Int,
    Float,
    Point,
    Vector,
    Plane,
    Transform,
    MultiPoint,
    Json,
}

/**
 * how to convert this object to a shader
 */
pub trait Renderable {

}

/**
 * what everything is for humans
 */
pub trait Descriptive {
    
}

/**
 * what everything is for machines
 */
pub trait Typed {
    
}

/**
 * how we can loop over this object
 */
pub trait Iterable {
    
}