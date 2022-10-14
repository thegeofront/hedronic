use std::io::{Cursor, Write, BufReader};

use las::{Writer, Point, Write as LasWrite, Builder, point::Format, Header, Reader, Read};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub struct Misc;

#[wasm_bindgen]
impl Misc {

    pub fn write_obj(verts: Vec<f64>, faces: Vec<u32>) -> String {
        
        let mut write = Cursor::new(Vec::new());
        // writeln!(&mut write, "# Hello World!").unwrap();

        for i in (0..verts.len()).step_by(3) {
            writeln!(&mut write, "v {:?} {:?} {:?}", verts[i], verts[i+1], verts[i+2]).unwrap();    
        }

        for i in (0..faces.len()-3).step_by(3) {
            writeln!(&mut write, "f {:?} {:?} {:?}", faces[i]+1, faces[i+1]+1, faces[i+2]+1).unwrap();    
        }

        // write.into_inner()
        String::from_utf8(write.into_inner()).expect("I think this should work")
    }

    pub fn write_las(positions: Vec<f64>) -> Vec<u8> {
        // let date = Date::new();
        
        let write = Cursor::new(Vec::new());

        let builder = Builder::from((1, 4));
        // builder.point_format = Format::new(0).unwrap();
        // builder.point_format.is_compressed = true;
        let header = builder.into_header().unwrap();
        // let header = Header::default();
        let mut writer = Writer::new(write, header).unwrap();

        for i in (0..positions.len()).step_by(3) {
            let point = Point { x: positions[i], y: positions[i+1], z: positions[i+2], ..Default::default() };
            writer.write(point).unwrap();
        }

        let cursor = writer.into_inner().expect("this should work");
        let blob: Vec<u8> = cursor.into_inner();
        blob
    }

    pub fn load_las(buffer: Vec<u8>) -> Vec<f64> {

        let curs = Cursor::new(buffer);
        let read = BufReader::new(curs);
        let mut reader = Reader::new(read).unwrap();
        let mut points = Vec::new();
        for wrapped_point in reader.points() {
            let point = wrapped_point.unwrap();
            // println!("Point coordinates: ({}, {}, {})", point.x, point.y, point.z);
            points.push(point.x);
            points.push(point.y);
            points.push(point.z);
        }
        points
    }
}
