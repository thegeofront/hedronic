
# Phase 1
[X] create a barebones canvas
[X] create a pannable camera 
[X] place rectangles on canvas 
[X] place standardized rectangles on a grid
 - [X] draw the grid  
[X] place different abstract nodes on a grid, with input & output indicators


[X] interact with the nodes properly
 - [X] create 
    - [X] menu or buttons
    - [ ] double click detection
 - [X] pick
    - [X] just use stupid logic for now, no need to be fancy 
    - [X] indicator
 - [X] move
    - [X] clicking  
 - [X] delete


[ ] cables
  - [X] creation by dragging
  - [X] updates when moving components
  - [X] delete automatically when component is deleted. it crashes now...
  - [X] deal with 1 to many connections. 
  - [X] many to 1 is forbidden. (to disable a whole range of bugs, make specific 'create static list' components, and do not allow many to 1 cables)
  - [ ] clickable & selectable
  - [ ] deletable when selected

> Speculation: how about a different type of node, one that is concerned only with the state of 1 variable. used for:
> - hardcoding state
> - viewing state
> - inputs & outputs

[ ] special nodes
    [ ] input nodes -> buttons
    [ ] output nodes -> lamps

[ ] run it!
  - [ ] sort operations last to first
  - [ ] run it, one way or another, using a list of callback functions.
  - [ ] print it out as javascript 




# phase 2 

...


# phase 3 

[] json loading, processing, and saving.
...