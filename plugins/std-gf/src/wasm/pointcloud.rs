use core::panic;
use las::{self, Reader, Read};
use serde_json::json;
use std::{io::Cursor, convert::TryInto};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use crate::wasm::bindings::GeoShaderType;

#[wasm_bindgen]
#[derive(Debug)]
pub struct Pointcloud {
    reader: Reader,
}

#[wasm_bindgen]
impl Pointcloud {
    
    pub fn new_from_buffer(buffer: &[u8]) -> Self {
        let cursor = Cursor::new(buffer.to_owned());
        let reader = Reader::new(cursor).unwrap();
        let head = reader.header();
        
        println!("version: {}", head.version());
        println!("count: {} points.", head.number_of_points());
        println!("extends: {:?} points.", head.bounds());

        Self { reader }
    }

    pub fn version(&self) -> Vec<u8> { 
        let v = self.reader.header().version(); 
        vec![v.minor, v.major]
    }
    pub fn bounds(&self) -> Vec<f64> { 
        let b = self.reader.header().bounds();
        vec![b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z] 
    }

    pub fn to_array(&mut self) -> Vec<f64> {
        
        const POINT_SIZE: usize = 3;

        let head = self.reader.header();
        let num_points: usize = head.number_of_points().try_into().unwrap();        
        let mut vector = Vec::with_capacity(num_points * POINT_SIZE);

        for point in self.reader.points() {
            let p = point.unwrap();  
            vector.push(p.x);
            vector.push(p.y);
            vector.push(p.z);
        }

        vector
    }

    pub fn length_of_buffer(buffer: &[u8]) -> i32 {
        buffer.len() as i32
    }
}

// impl Renderable for PointCloud 
#[wasm_bindgen]
impl Pointcloud {

    pub fn gf_has_trait_renderable() -> bool {
        true
    }

    pub fn gf_get_shader_type() -> GeoShaderType {
        GeoShaderType::MultiPoint
    }

    pub fn gf_get_bounding_box(&self) -> JsValue {
        let b = self.reader.header().bounds();
        let value = json!({
            "x_min": b.min.x,
            "y_min": b.min.y,
            "z_min": b.min.z,
            "x_max": b.max.x,
            "y_max": b.max.y,
            "z_max": b.max.z,
        });
        JsValue::from_serde(&value).unwrap()
    }

    // pub fn gf_get_buffers(&self) -> JsValue {
    //     let buffer =  {
    //         x: self.data.x,
    //         y: self.data.y,
    //         z: self.data.z,
    //     };
    //     JsValue::from_serde(&buffer).unwrap()
    // }
}