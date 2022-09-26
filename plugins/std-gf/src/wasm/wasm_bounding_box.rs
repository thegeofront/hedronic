use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::wasm_bindgen;
use crate::{BoundingBox, wasm::Point};

#[derive(Serialize, Deserialize)]
#[wasm_bindgen(js_name = BoundingBox)]
pub struct WasmBoundingBox {
    #[wasm_bindgen(skip)]
    pub data: BoundingBox
}

impl WasmBoundingBox {
    fn new_raw(data: BoundingBox) -> Self {
        Self { data }
    }
}

#[wasm_bindgen(js_class = BoundingBox)]
impl WasmBoundingBox {
    
    pub fn new(min: Point, max: Point) -> Self {
        Self::new_raw(BoundingBox::new(min.data, max.data))
    }

    pub fn new_from_bounds(x1: f64, y1: f64, z1: f64, x2: f64, y2: f64, z2: f64) -> Self {
        Self::new_raw(BoundingBox::new_from_bounds(x1, y1, z1, x2, y2, z2))
    }

    pub fn new_from_radii(x: f64, y: f64, z: f64) -> Self {
        Self::new_raw(BoundingBox::new_from_radii(x, y, z))
    }
}