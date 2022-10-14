use serde::{Serialize, Deserialize};

use crate::Vec3;

use super::mapping::{elevate, remap, normalize, includes};

#[derive(Serialize, Deserialize)]
pub struct BoundingBox {
    min: Vec3,
    max: Vec3,
}

impl BoundingBox {

    pub const NAN: Self = Self::new(Vec3::NAN, Vec3::NAN); 
    pub const NORMAL: Self = Self::new(Vec3::ZERO, Vec3::ONE); 

    pub const fn new(min: Vec3, max: Vec3) -> Self {
        Self {min, max}
    }

    pub const fn new_from_bounds(x1: f64, y1: f64, z1: f64, x2: f64, y2: f64, z2: f64) -> Self {
        Self {
            min: Vec3::new(x1, y1, z1), 
            max: Vec3::new(x2, y2, z2)
        }
    }

    pub fn new_default() -> Self {
        Self::new(
            Vec3::NAN.clone(),
            Vec3::NAN.clone()
        )
    }

    pub fn new_from_radii(x: f64, y: f64, z: f64) -> Self {
        Self::new_from_bounds(x, y, z, -x, -y, -z)
    }

    pub fn includes(&self, value: Vec3) -> bool { 
        includes(self.min.x, self.max.x, value.x) &&
        includes(self.min.y, self.max.y, value.y) &&
        includes(self.min.z, self.max.z, value.z)
    }

    pub fn normalize(&self, value: Vec3) -> Vec3 {
        Vec3::new(
            normalize(self.min.x, self.max.x, value.x),
            normalize(self.min.y, self.max.y, value.y),
            normalize(self.min.z, self.max.z, value.z)
        )
    }

    pub fn elevate(&self, value: Vec3) -> Vec3 { 
        Vec3::new(
            elevate(self.min.x, self.max.x, value.x),
            elevate(self.min.y, self.max.y, value.y),
            elevate(self.min.z, self.max.z, value.z)
        )
    }

    pub fn remap(&self, other: &BoundingBox, value: Vec3) -> Vec3 { 
        Vec3::new(
            remap(self.min.x, self.max.x, other.min.x, other.max.x, value.x),
            remap(self.min.y, self.max.y, other.min.y, other.max.y, value.y),
            remap(self.min.z, self.max.z, other.min.z, other.max.z, value.z)
        )
    }
}
