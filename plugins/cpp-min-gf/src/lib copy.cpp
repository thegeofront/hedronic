// quick_example.cpp
#include <emscripten/bind.h>
#include <cmath>

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

    double distance(Point other) {
        return std::pow(
            std::pow(x - other.x, 2) + std::pow(y - other.y, 2), 
            0.5);
    }
};

EMSCRIPTEN_BINDINGS(cpp_min) {
    function("add", &add);
    class_<Point>("Point")
        .constructor<double, double>()
        .function("distance", &Point::distance)
        .property("x", &Point::x)
        .property("y", &Point::y);
}