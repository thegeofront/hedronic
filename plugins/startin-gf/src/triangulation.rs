/*
 * NOTE: taken for a large part from: https://github.com/hugoledoux/startin_wasm/blob/master/src/lib.rs
 * 
 */ 

use glam::Vec3;
use wasm_bindgen::{prelude::*, JsObject};
use startin;

use crate::bindings::{GeoShaderType, MeshBuffer};

#[wasm_bindgen]
pub struct Triangulation {
    dt: startin::Triangulation,
}

#[wasm_bindgen]
impl Triangulation {

    pub fn new_from_vec(pts: Vec<f64>) -> Triangulation {
        let mut tri = Triangulation::new();
        tri.insert(pts);
        tri
    } 

    pub fn new() -> Triangulation {
        let dt = startin::Triangulation::new();
        Triangulation { dt }
    }

    pub fn insert(&mut self, pts: Vec<f64>) {
        const STRIDE: usize = 3;
        for i in (0..pts.len()).step_by(STRIDE) {
            self.insert_one_pt(pts[i], pts[i+1], pts[i+2]);
        }
    }

    // ...

    pub fn insert_one_pt(&mut self, px: f64, py: f64, pz: f64) -> bool {
        let _re = self.dt.insert_one_pt(px, py, pz);
        true
    }

    pub fn number_of_vertices(&self) -> usize {
        self.dt.number_of_vertices()
    }

    pub fn number_of_triangles(&self) -> usize {
        self.dt.number_of_triangles()
    }

    pub fn all_vertices(&self) -> Vec<f64> {
        let mut pts: Vec<f64> = Vec::new();
        let opts = self.dt.all_vertices();
        for each in opts.iter() {
            pts.push(each[0]);
            pts.push(each[1]);
            pts.push(each[2]);
        }
        pts
    }

    fn all_vertices_z(&self) -> Vec<f64> {
        let mut pts: Vec<f64> = Vec::new();
        let opts = self.dt.all_vertices();
        for each in opts.iter() {
            // pts.push(each[0]);
            // pts.push(each[1]);
            pts.push(each[2]);
        }
        pts
    }

    pub fn all_edges(&self) -> Vec<usize> {
        self.dt.all_edges()
    }

    pub fn all_triangles(&self) -> Vec<usize> {
        let mut trs: Vec<usize> = Vec::new();
        let otrs = self.dt.all_triangles();
        for each in otrs.iter() {
            trs.push(each.v[0]);
            trs.push(each.v[1]);
            trs.push(each.v[2]);
        }
        trs
    }

    // pub fn closest_point(&self, px: f64, py: f64) -> usize {
    //     let re = self.dt.closest_point(px, py);
        
    // }

    // pub fn remove_vertices_with_index(mut self, ids: Vec<usize>) -> Self {
    //     for id in ids {
    //         let re = self.dt.remove(id);
    //     }
    //     self
    // }

    pub fn isolevel(&self, level: f64, levels: Option<Vec<f64>>) -> Option<Vec<f64>> {

        // ensure valid levels. if ommited, use z value of vertices
        let levels = match levels {
            None => self.all_vertices_z(),
            Some(x) => {
                if x.len() != self.dt.number_of_vertices() {
                    return None;
                }
                x
            },
        };

        // first, implement 'marching triangle'
        // just an array of line segments. TODO do a better data structure
        let mut edges: Vec<f64> = Vec::new();
        let verts = self.dt.all_vertices();

        // each triangle will produce 0 or 1 line segments
        // TODO opt out early after 2 unsuccessful ones
        for tr in self.dt.all_triangles().iter() {
           
            #[allow(non_snake_case)]
            let (A, B, C) = (0,1,2);

            let la = levels[tr.v[A]];
            let lb = levels[tr.v[B]];
            let lc = levels[tr.v[C]];
            let ls = vec![la, lb, lc];

            let a = verts.get(tr.v[A]).unwrap();
            let b = verts.get(tr.v[B]).unwrap();
            let c = verts.get(tr.v[C]).unwrap();
            let pts = vec![a, b, c];

            let marching_triangle: u8 = (la < level) as u8 + (lb < level) as u8 * 2 + (lc < level) as u8 * 4;
            assert!(marching_triangle < 8);

            //   C 
            //  / \
            // A---B
            // edges go from low to high. the order is important (lhs, rhs)
            let edge: Option<(usize, usize, usize, usize)> = match marching_triangle {
                // CBA
                0b0000 => None, // empty
                0b0001 => Some((B, A, C, A)), 
                0b0010 => Some((C, B, A, B)),  
                0b0011 => Some((C, B, C, A)), 
                0b0100 => Some((A, C, B, C)), 
                0b0101 => Some((B, A, B, C)),  
                0b0110 => Some((A, C, A, B)), 
                0b0111 => None, // filled
                _      => None,
            };

            let edge = match edge {
                None => continue,
                Some(e) => e,
            };

            let (i,j,k,l) = edge;

            // TODO make an option to put level at 0.5.
            edges.extend(lerp(pts[i], pts[j], norm(ls[i], ls[j], level)));
            edges.extend(lerp(pts[k], pts[l], norm(ls[k], ls[l], level)));
        }

        return Some(edges);
    }
}

impl Triangulation {
    
    pub fn bounding_box(&self) -> Option<f32> {
        None
        // let hull = self.dt.convex_hull();

        // if hull.len() < 1 {
        //     return [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
        // }

        // let min = DVec3::new();

        // for i in hull {
        //     i
        // }
    }
}

// impl Renderable for Triangulation 
#[wasm_bindgen]
impl Triangulation {

    pub fn gf_has_trait_renderable() -> bool {
        true
    }

    pub fn gf_get_shader_type() -> GeoShaderType {
        GeoShaderType::Mesh
    }

    pub fn gf_get_buffers(&self) -> JsValue {
        let buffer = MeshBuffer {
            verts: self.all_vertices(),
            cells: self.all_triangles(),
        };
        serde_wasm_bindgen::to_value(&buffer).unwrap()
    }
}




/**
 * normalize parameter `p` in the domain `a` to `b`;
 */
fn norm(a: f64, b: f64, p: f64) -> f64 {
    (p - a) / (b - a)   
}

/**
 * linearly interpolate a new vector in between vectors `a` and `b` with normalized parameter `p`
 */
fn lerp(a: &Vec<f64>, b: &Vec<f64>, p: f64) -> Vec<f64> {
    a.iter().zip(b).map(|(a, b)| a * (1.0 - p) + b * p).collect()
}

/**
 * combines norm and lerp
 */
fn norm_lerp(a: &Vec<f64>, b: &Vec<f64>, a_factor: f64, b_factor: f64, factor: f64) -> Vec<f64> {
    lerp(a, b, norm(a_factor, b_factor, factor))
}