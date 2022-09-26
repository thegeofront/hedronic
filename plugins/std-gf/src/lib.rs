#![allow(dead_code)]

use wasm_bindgen::prelude::*;

// these things are so common and 'basic' in a sense, that I think the lowercase stuff is justified
pub use glam::{DAffine2 as aff2};
pub use glam::{DAffine3 as aff3};
pub use glam::{DMat3 as mat3};
pub use glam::{DMat4 as mat4};
pub use glam::{DQuat as quad};
pub use glam::{DVec2 as vec2};
pub use glam::{DVec3 as vec3};

// all exports 
mod algorithms;
mod basic;
mod data;

pub use crate::data::*;
pub use crate::basic::*;

// the setup for wasm loading
mod wasm;

#[wasm_bindgen]
extern "C" {
    // fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(start, skip_typescript)]
pub fn start() {
    crate::wasm::bindings::set_panic_hook();
}
