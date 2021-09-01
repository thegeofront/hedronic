# Phase 1
[X] create a barebones canvas
[X] create a pannable camera 
[X] place rectangles on canvas 
[X] place standardized rectangles on a grid
 - [X] draw the grid  
[X] place different abstract nodes on a grid, with input & output indicators


[X] nodes
 - [X] create 
    - [X] menu or buttons
    - [ ] double click detection
 - [X] pick
    - [X] just use stupid logic for now, no need to be fancy 
    - [X] indicator
 - [X] move
    - [X] clicking  
 - [X] delete

[X] cables 
  - [X] creation by dragging
  - [X] updates when moving components
  - [X] delete automatically when component is deleted. it crashes now...
  - [X] deal with 1 to many connections. 
  - [X] many to 1 is forbidden. (to disable a whole range of bugs, make specific 'create static list' components, and do not allow many to 1 cables)


[X] run it!
  - [X] sort operations last to first
  - [X] run it, one way or another, using a list of callback functions.
  - [X] print it out as javascript 


[X] gizmos
  - [X] create and render an unconnected gizmo
  - [X] create and render a gizmo which shows the state of the cable
  - [X] create and render a gizmo with the ability to be pressed, like a switch button


[X] special nodes
    [X] input nodes -> buttons
    [X] output nodes -> lamps