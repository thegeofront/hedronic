// quick_example.cpp
#include <emscripten/bind.h>

using namespace emscripten;

float add(float left, float right) {
    return left + right;
}

class Point {
public:
    double x;
    double y;

    Point(double x, double y) :
        x(x),
        y(y) {}

    void increase() {
        x++;
    }

    int squareCounter() {
        return x * y;
    }
};

EMSCRIPTEN_BINDINGS(cpp_min) {
    function("add", &add);
    class_<Point>("Point")
        .constructor<double, double>()
        .function("increase", &Point::increase)
        .function("squareCounter", &Point::squareCounter)
        .property("x", &Point::x)
        .property("y", &Point::y);
}