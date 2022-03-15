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
git clone https://github.com/thegeofront/engine
cd engine 
npm install
cd ..
```

then clone and install the actual repo 
```shell
git clone https://github.com/thegeofront/app
cd app
npm install
npm run build-all
```
finally, serve the `public` folder using something like 
[live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or [python's http server](https://docs.python.org/3/library/http.server.html)
[]


