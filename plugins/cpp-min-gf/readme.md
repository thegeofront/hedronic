# build with:
```
emcc --bind -O3 add.cpp

emcc -Wl,-rpath,./wasm -Wl,-rpath,./wasm --rtlib=compiler-rt -Wl,-rpath,./wasm -Wl,-rpath,./wasm --rtlib=compiler-rt --no-entry -sALLOW_MEMORY_GROWTH=1 -sFORCE_FILESYSTEM=1 -sEXPORT_ALL=1 -sLINKABLE=1 -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=libfrutil
```

