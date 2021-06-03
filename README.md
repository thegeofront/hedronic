# GEON-NODES
Starting my thesis by making a flowchart-application / VPL

# Roadmap

##  Phase 1
- Create a 'logic gate' app. Could be used stand-alone to teach about how to build a computer from first principles (AND, OR, XOR)
  - Inspired by https://www.youtube.com/watch?v=QZwneRb-zqA
- This will get the gui basics down for the rest of the thesis
- I will not focus on anything else right now, I will just try to create a nice-to-use VPL.
- Only acceptable parameter: boolean 
- Simple gates
- Dragging & clicking, deleting, etc... 
- Drawing using HTML canvas (seems to make the most sense for this application)


##  Phase 2 
- Figure out how to `save` and `load` the flowchart to a `flowchart.json` or even a `flowchart hash`
- Figure out how to `compile` the flowchart to javascript.
- Figure out how to write a normal javascript function, and `publish` it like a flowchart component.
- Try to make some javascript library, external, and figure out how it can be loaded like a plugin
    - still, only booleans as in and output at this point. 
- (keep this tool around as-it-is right now, could be useful as an educational tool)


## Phase 3 
- Make this application ready for geo business & wasm. 
  - Make the components accept json-serializable data. 
    - The Json, and more specifically the serde::Value enum, will be the standard for all data transfer between components. 
    - This will make all json-based data (cityjson, WFS, user-submitted) first-class citizens within this environment.
    - This solves a number of problems that will come up later.
- Add a mesh visualizer


## Phase 4
> Time for serious business 
- Add the cj-val-rs wasm binary to this flowchart tool.
- Load various cityjsons, and validate them using the flowchart
- Analyze and visualize the mistakes within the cityjson
- Parse **\[TO BE DETERMINED\]** library as a plugin to this environment.









