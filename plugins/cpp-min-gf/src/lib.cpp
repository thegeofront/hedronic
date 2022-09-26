// quick_example.cpp
#include <emscripten/bind.h>

using namespace emscripten;

float add(float left, float right) {
    return left + right;
}

class Point {
public:
    double _x;
    double _y;

    Point(double x, double y) :
    _x(x),
    _y(y) {}

    void increase() {
        _x++;
    }

    int squareCounter() {
        return _x * _y;
    }
};

EMSCRIPTEN_BINDINGS(cpp_min) {
    function("add", &add);
    class_<Point>("Point")
        .constructor<double, double>()
        .function("increase", &Point::increase)
        .function("squareCounter", &Point::squareCounter)
        .property("counter", &Point::counter);
}