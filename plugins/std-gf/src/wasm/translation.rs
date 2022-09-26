use serde::{Serialize, Deserialize};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[wasm_bindgen]
#[derive(Serialize, Deserialize, Debug)]
pub struct Translation {
    x: f64,
    y: f64,
    z: f64
}

#[wasm_bindgen]
impl Translation {

    pub fn new(x: Option<f64>, y: Option<f64>, z: Option<f64>) -> Self {
        Vector {
            x : x.unwrap_or(0.0), 
            y : y.unwrap_or(0.0), 
            z : z.unwrap_or(0.0)
        }
    }
}

// These functions have magic names, and we need them on the 
// javascript side to make the flowchart work and operate smoothly
#[wasm_bindgen] 
impl Translation {
    pub fn __get_type__() -> String {
        "vector-3".into()
    }

    pub fn __from_json__(_json: JsValue) {
        // TODO
    }

    pub fn __from_json_string__(_str: String) {
        // TODO   
    }

    pub fn __to_json__(&self) -> JsValue {
        JsValue::from_serde(&self).unwrap()
    }

    pub fn __to_json_string__(&self) -> String {
        serde_json::to_string(&self).unwrap()
    }
}