# GEON-NODES
![image](doc/images/thumbnail.png)

# what is it 

A component of my master thesis involves a flowchart-application / VPL. And since I couldn't find  any web-based flowchart api which satisfied the requirements, I had to create this

# Demo

[Here](josfeenstra.nl/wip/nodes)

# Roadmap

##  Phase 1 - Flowchart
- Create a web 'logic gate' app. Could be used stand-alone to teach about how to build a computer from first principles (AND, OR, XOR)
  - Inspired by https://www.youtube.com/watch?v=QZwneRb-zqA
- This will get the gui basics down
- I will not focus on anything else in this phase, I will just try to create a nice-to-use VPL.
- Only acceptable parameter: boolean 
- Simple gates (AND, OR, NOT, XOR), just like that video
- Dragging & clicking, deleting, etc... 
- Drawing using HTML canvas / or webgl, not sure which is better at this point
> Chose canvas API. introduces some inefficiencies, but it does the job. 
> we *COULD* also hack html to create nodes and cables, and make them stylable using regular css...
> hmmmmm...


##  Phase 2 - Utility
- Figure out how to `save` and `load` the flowchart to a `flowchart.json` or even a `flowchart hash`.
- Figure out how to `compile` the flowchart to javascript.
- Figure out how to write a normal javascript function, and `publish` it like a flowchart component.
- Try to make some javascript library, external, and figure out how it can be loaded like a plugin
    - still, only booleans as in and output at this point. 
- (keep this tool around as-it-is right now, could be useful as an educational tool)


## Phase 3 - Geometry 
> Note: unsure about this part
- Make this application ready for geo business & wasm. 
  - Make the components accept json-serializable data. 
    - The Json, and more specifically the serde::Value enum, will be the standard for all data transfer between components. 
    - This will make all json-based data (cityjson, WFS, user-submitted) first-class citizens within this environment.
    - This solves a number of problems that will come up later.
- Add a mesh visualizer

Serde::Value looks like this
```rust
pub enum Value {
    Null,
    Bool(bool),
    Number(Number),
    String(String),
    Array(Vec<Value>),
    Object(Map<String, Value>),
}
``` 
could be used to represent basicly anything. It will be the function's problem to deserialize these values.


## Phase 4 - Geospatial
> Time for serious business 
- Add the cj-val-rs wasm binary to this flowchart tool.
- Load various cityjsons, and validate them using the flowchart
- Analyze and visualize the mistakes within the cityjson
- Parse **\[TO BE DETERMINED\]** library as a plugin to this environment.


## Phase 5 - Usage
- This project is not complete without making some things with this environment.
  - Examples 
  - Demo's
- Create 'something' whose existence validates the creation of this whole environment.







