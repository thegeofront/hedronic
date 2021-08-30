# GEON-NODES
![image](doc/images/thumbnail.png)

# what is it 

A component of my master thesis involves a flowchart-application or VPL (Visual Programming Language). Since I couldn't find any web-based flowchart api which satisfied the requirements, I created this.

# Demo

[Here](https://josfeenstra.nl/project/nodes)

# Roadmap
> this is a sketch, nothing is final

##  Phase 1 - Flowchart ✔️
- Create a web 'logic gate' app. Could be used stand-alone to teach about how to build a computer from first principles (AND, OR, XOR)
  - Inspired by https://www.youtube.com/watch?v=QZwneRb-zqA
- This will get the gui basics down
- I will not focus on anything else in this phase, I will just try to create a nice-to-use VPL.
- Only acceptable parameter: boolean 
- Simple gates (AND, OR, NOT, XOR), just like that video
- Dragging & clicking, deleting, etc... 
- Drawing using HTML, 2d canvas, or webgl, not sure which is better at this point

> Chose canvas API. introduces some inefficiencies, but it does the job. 
> we *COULD* also hack html to create nodes and cables, and make them stylable using regular css...
> hmmmmm...


##  Phase 2 - Utility ⚙️
- [X] Figure out how to `save` and `load` the flowchart to a `flowchart.json` or even a `flowchart hash`.
- [X] Figure out how to `compile` the flowchart to javascript.
- [X] Figure out how to write a normal javascript function, and `publish` it like a flowchart component.
    - [X] Do the same, but now generate multiple components, one for each element of the script.
- [ ] Try to make some javascript library, external, and figure out how it can be loaded like a plugin
    - still, only booleans as in and output at this point. 
- [ ] (keep this tool around as-it-is right now, could be useful as an educational tool)


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




# Status
In phase 1 is done! It still crashes often, cyclical patterns are not guarded against yet, but the script is finally alive in a way! Now on to phase 2





