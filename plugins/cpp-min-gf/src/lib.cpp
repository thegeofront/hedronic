// quick_example.cpp
#include <emscripten/bind.h>

using namespace emscripten;

float add(float left, float right) {
    return left + right;
}

class Counter {
public:
    int counter;

    Counter(int init) :
    counter(init) {}

    void increase() {
        counter++;
    }

    int squareCounter() {
        return counter * counter;
    }
};

EMSCRIPTEN_BINDINGS(cpp_min) {
    function("add", &add);
    class_<Counter>("Counter")
        .constructor<int>()
        .function("increase", &Counter::increase)
        .function("squareCounter", &Counter::squareCounter)
        .property("counter", &Counter::counter);
}