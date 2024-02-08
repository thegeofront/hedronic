# Hedronic

A web-based VPL 

# Demo
[Here](https://thegeofront.github.io/)

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
npm run build-all
```
finally, serve the `public` folder using something like 
[live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or [python's http server](https://docs.python.org/3/library/http.server.html)
[]
