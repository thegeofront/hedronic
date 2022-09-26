use glam::DVec3;
use rand::{prelude::StdRng, SeedableRng, Rng};
use wasm_bindgen::prelude::wasm_bindgen;
use super::{MultiPoint, wasm_bounding_box::WasmBoundingBox};

/**
 * Basic rng
 */
#[wasm_bindgen]
pub struct Random {
    rng: StdRng
}

#[wasm_bindgen]
impl Random {

    pub fn new() -> Random {
        let rng = StdRng::from_entropy();
        Random {rng}
    }   

    pub fn new_from_seed(n: f64) -> Random {
        let rng = StdRng::seed_from_u64(n as u64);
        Random {rng}
    }

    pub fn spawn_points(&mut self, count: usize, bounds: &mut WasmBoundingBox) -> MultiPoint {
        
        let mut results = Vec::with_capacity(count*3);
        let r = &mut self.rng;

        for _ in 0..count {
            let point = bounds.data.elevate(DVec3::new(r.gen(), r.gen(), r.gen()));
            results.push(point.x);
            results.push(point.y);
            results.push(point.z);
        }

        MultiPoint::new_from_array(results)
    }
}

