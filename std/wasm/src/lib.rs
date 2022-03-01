mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// How to get js INTO rust 
#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

// How to get Rust INTO js 
#[wasm_bindgen]
pub fn greet() {
    alert("Hello, game-of-life!");
}

#[wasm_bindgen]
pub fn add(a: f32, b: f32) -> f32 {
    return a + b;
}

#[wasm_bindgen]
pub fn subtract(a: f32, b: f32) -> f32 {
    return a - b;
}

#[wasm_bindgen]
pub fn get_list(a: f32, length: usize) -> Vec<f32> {
    let arr = vec![a; length];
    return arr;
}