# build with:
```
emcc --bind -O3 add.cpp

emcc --no-entry -sALLOW_MEMORY_GROWTH=1 -sEXPORT_ALL=1 -sMODULARIZE=1 -sEXPORT_ES6=1 -sEXPORT_NAME=cpp_min -o3 --bind src/lib.cpp
```

