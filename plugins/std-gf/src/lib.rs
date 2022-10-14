#![allow(dead_code)]

use wasm_bindgen::prelude::*;

pub use glam::{DAffine2 as Aff2};
pub use glam::{DAffine3 as Aff3};
pub use glam::{DMat3 as Mat3};
pub use glam::{DMat4 as Mat4};
pub use glam::{DQuat as Quad};
pub use glam::{DVec2 as Vec2};
pub use glam::{DVec3 as Vec3};

mod algorithms;
mod basic;
mod data;

pub use crate::data::*;
pub use crate::basic::*;

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
