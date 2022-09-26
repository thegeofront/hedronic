use super::mapping::{elevate, remap, normalize, includes, Mapping};

#[derive(Clone)]
pub struct Bounds {
    min: f64,
    max: f64,
}

impl Bounds {

    pub const NORMAL: Self = Self::new(0.0, 1.0);
    pub const NAN: Self = Self::new(f64::NAN, f64::NAN);
    
    #[inline]
    pub const fn new(min: f64, max: f64) -> Self {
        Self {min, max}
    } 

    #[inline]
    pub fn new_from_radius(r: f64) -> Self {
        Self::new(-r, r)
    }

    pub fn new_from_include(data: Vec<f64>) -> Self {
        // create a new domain which bounds all parsed values
        let mut min = f64::INFINITY;
        let mut max = f64::NEG_INFINITY;

        if data.len() == 0 {
            return Self::NAN.clone()
        }

        for val in data {
            if val < min { min = val };
            if val > max { max = val };
        }

        return Self::new(min, max);
    }
}

impl Mapping<f64> for Bounds {

    fn includes(&self, value: f64) -> bool { 
        includes(self.min, self.max, value) 
    }

    fn normalize(&self, value: f64) -> f64 { 
        normalize(self.min, self.max, value) 
    }

    fn elevate(&self, value: f64) -> f64 { 
        elevate(self.min, self.max, value) 
    }

    fn remap(&self, other: &Bounds, value: f64) -> f64 { 
        remap(self.min, self.max, other.min, other.max, value) 
    }
}

