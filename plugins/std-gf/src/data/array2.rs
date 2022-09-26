use wasm_bindgen::prelude::*;

/**
 * A generic two dimensional array / matrix.
 * NOTE: using 'array2' instead of 2dVec or Matrix or something, to not confuse this one with Matrix4 and Vec3 types.  
 * NOTE: under construction
 */
#[wasm_bindgen(inspectable)]
pub struct Array2 {
    pub width: usize,
    pub height: usize,
    d: Vec<f64>
}

impl Array2 {

    pub fn new_from_vec_2d(vec: Vec<Vec<f64>>) -> Self {
        assert!(vec.len() > 0 && vec[0].len() > 0);
        let height = vec.len();
        let width = vec[0].len(); 
        let mut matrix = Self::new(width, height);
        matrix.fill(vec);
        matrix
    }

    pub fn fill(&mut self, vec: Vec<Vec<f64>>) -> bool {  
        assert!(vec.len() == self.height && vec[0].len() == self.width);
        for (i, row) in vec.iter().enumerate() {
            for (j, value) in row.iter().enumerate() {
                self.set(i, j, *value);
            }
        }
        true
    }
}

// #[wasm_bindgen]
impl Array2 {

    pub fn new(width: usize, height: usize) -> Self {

        let d = vec![0.0; width * height];
        Self {width, height, d}
    }

    pub fn get_some(&mut self) {
        // let arr = JsValue::from(self.to_vec());
        // vec![JsValue::from_str("GFPoint"), arr].into_boxed_slice()
    }

    pub fn new_from_vec(vec: Vec<f64>, width: usize) -> Self {
        assert!(vec.len() % width == 0);
        let height = vec.len() / width;
        Self {width, height, d: vec}
    }

    pub fn set(&mut self, row: usize, col: usize, value: f64) -> bool {
        assert!(col < self.width);
        assert!(row < self.height);
        self.d[(row * self.width + col)] = value;
        true
    }

    pub fn set_row(&mut self, row: usize, values: Vec<f64>) -> bool {
        assert!(values.len() < self.width);
        assert!(row < self.height);
        for (i, value) in values.iter().enumerate() {
            self.set(row, i, *value);
        }
        true
    }

    pub fn get(&self, row: usize, col: usize) -> f64 {
        assert!(col < self.width);
        assert!(row < self.height);
        self.d[row * self.width + col]
    }

    pub fn to_vec(&mut self) -> Vec<f64> {
        self.d.clone()
    }
}

pub fn points(a: bool) -> Vec<f64> {

    let mut pts: Vec<Vec<f64>> = Vec::new();
    pts.push(vec![20.0, 30.0, 2.0]);
    pts.push(vec![120.0, 33.0, 12.5]);
    pts.push(vec![124.0, 222.0, 7.65]);
    pts.push(vec![20.0, 133.0, 21.0]);
    pts.push(vec![60.0, 60.0, 33.0]);

    if a {
        pts.push(vec![60.0, 70.0, 33.0]);
    }

    Array2::new_from_vec_2d(pts).to_vec()
}