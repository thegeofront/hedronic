use core::panic;
use serde::{Serialize, Deserialize};
use serde_json::json;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

// use glam for the vector business
use glam::DVec3 as vec3;

use crate::wasm::bindings::{GeoType};

#[derive(Serialize, Deserialize)]
#[wasm_bindgen()]
#[derive(Debug)]
pub struct Point {

    #[wasm_bindgen(skip)]
    pub data: vec3
}

#[wasm_bindgen]
impl Point {
    
    pub fn new(x: f64, y: f64, z: f64) -> Point {
        Point { data: vec3::new(x, y, z) }
    }

    pub fn add_num(&mut self, x: f64, y: f64, z: f64) {
        self.data.x += x;
        self.data.y += y;
        self.data.z += z;
    }
}
 
///////////////////////////////////////////////////////////////////////////////////

// impl Typed for Point
#[wasm_bindgen]
impl Point {

    pub fn gf_has_trait_typed() -> bool {
        true
    }
    pub fn gf_is_convertable_to(gt: GeoType) -> bool {
        match gt {
            GeoType::Json | GeoType::Point => true,
            _ => false,
        }
    }
    pub fn gf_default() -> Self {
        Point { data: vec3::ZERO.clone() }
    }

    pub fn gf_to_json(&self) -> JsValue {
        JsValue::from_serde(&self.data).unwrap()
    }

    pub fn gf_from_json(val: &JsValue) -> Self {
        val.into_serde().unwrap()
    }
}

// impl descriptive for Point 
#[wasm_bindgen]
impl Point {

    pub fn gf_has_trait_descriptive() -> bool {
        true
    }

    pub fn gf_get_description() -> JsValue {
        let value = json!({
            "gf_type": "This is a normal, cartesian point in 3D space. It uses f64 internally.",
            "new": "Create a new point.",
            "distance": "The distance between two points",
        });
        JsValue::from_serde(&value).unwrap()
    }
}

// impl Iterable for Point 
#[wasm_bindgen]
impl Point {

    pub fn gf_has_trait_iterable() -> bool {
        true
    }

    pub fn gf_get_base_type() -> GeoType {
        GeoType::Float
    }

    pub fn gf_get_length(&self) -> usize {
        3
    }

    pub fn gf_get_item(&self, index: usize) -> Option<f64> {
        match index {
            0 => Some(self.data.x),
            1 => Some(self.data.y),
            2 => Some(self.data.z),
            _ => None,
        }
    }
}