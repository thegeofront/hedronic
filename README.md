# GEON-NODES / Geofront

# what is it 
A component of my master thesis involves a flowchart-application or VPL (Visual Programming Language). I couldn't find any web-based flowchart api which satisfied the requirements, so I set out to create a new one.

# Demo
[Here](https://josfeenstra.nl/project/nodes)

# Roadmap MVP
> status 
> 🚧: Busy
> ⏹️: On hold
> ✔️: Done 

# install
we need the 3d engine locally present. We use it as a 'header only' dependency at the moment for rapid development
```shell
git clone https://github.com/josfeenstra/geon-engine engine
cd engine 
npm install
cd ..
```

then clone and install the actual repo 
```shell
git clone https://github.com/josfeenstra/geon-nodes nodes
cd nodes
npm install
npm run build-wasm
npm run build-std
npm run build
```
finally, serve the `public` folder using something like 
[live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or [python's http server](https://docs.python.org/3/library/http.server.html)
[]

# TRUE TODO:
- [X] display / load plugins hierarchically
- [ ] laz / xyz loader  
- [ ] pointcloud visualize (height shader, like [this](https://potree.entwine.io/data/ahn.html))
- [ ] array getters & setters
- [ ] object getters & setters

# COOL TODO:
- [ ] camera location input widget 
  -> connect to wfs loader