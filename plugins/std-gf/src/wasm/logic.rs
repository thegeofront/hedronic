use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct Logic {}

#[wasm_bindgen] 
impl Logic {
    pub fn and(a: bool, b: bool) -> bool { a && b }
    pub fn or(a: bool, b: bool) -> bool { a || b }
    pub fn not(a: bool) -> bool { !a }

    pub fn equals(a: f64, b: f64) -> bool { a == b }
    pub fn smaller(a: f64, b: f64) -> bool {a < b }
    pub fn greater(a: f64, b: f64) -> bool { a > b }

    pub fn smaller_or_equals(a: f64, b: f64) -> bool { a <= b }
    pub fn greater_or_equals(a: f64, b: f64) -> bool { a >= b }
}
