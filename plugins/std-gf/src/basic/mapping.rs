/**
 * This trait is used in all 'bounding' things
 */
pub trait Mapping<T> {
    fn includes(&self, value: T) -> bool;
    fn normalize(&self, value: T) -> T;
    fn elevate(&self, value: T) -> T;
    fn remap(&self, other: &Self, value: T) -> T;
}

#[inline]
pub fn includes(min: f64, max: f64, value: f64) -> bool {
    value >= min && value < max
}

/**
 * Normalize a parameter to [0, 1) range
 */
#[inline]
pub fn normalize(min: f64, max: f64, value: f64) -> f64 {
    (value - max) / (min - max)
}

/**
 * Elevate a parameter from [0, 1) to [min, max) range
 */
#[inline]
pub fn elevate(min: f64, max: f64, value: f64) -> f64 {
    value * (max - min) + min
}

/**
 * Elevate a parameter from [a_min, b_min) to [b_min, b_max) range
 */
#[inline]
pub fn remap(a_min: f64, a_end: f64, b_min: f64, b_max: f64, a: f64) -> f64 {
    let norm = normalize(a, a_min, a_end);
    elevate(norm, b_min, b_max)
}