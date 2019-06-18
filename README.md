# `pinhole-js`

3D Wireframe Drawing Library for Javavscript. This is a port of [pinhole](https://github.com/tidwall/pinhole) for Go.

<a href="http://tidwall.com/pinhole/">Demo</a>

<img src="http://i.imgur.com/EhtVA6C.jpg" width="200" height="200" alt="earth"><img src="http://i.imgur.com/fKe1N3E.jpg" width="200" height="200" alt="shapes"><img src="http://i.imgur.com/qQRqGPe.jpg" width="200" height="200" alt="spiral">

## Why does this exist?

I needed a CPU based 3D rendering library with a very simple API for visualizing data structures. No bells or whistles, just clean lines and solid colors.

## Getting Started

### Using

The coordinate space has a locked origin of `0,0,0` with the min/max boundaries of `-1,-1,-1` to `+1,+1,+1`.
The `Z` coordinate extends from `-1` (nearest) to `+1` (farthest).

There are four types of shapes; `line`, `cube`, `circle`, and `dot`. 
These can be transformed with the `Scale`, `Rotate`, and `Translate` functions.
Multiple shapes can be transformed by nesting in a `Begin/End` block.


A simple cube:

```go
var p = new Pinhole();
p.drawCube(-0.3, -0.3, -0.3, 0.3, 0.3, 0.3);
p.render(canvasElement, {bgColor:'white'});
```

<img src="http://i.imgur.com/ofJ2T7Y.jpg" width="300" height="300">


Rotate the cube:

```go
var p = pinhole.New();
p.drawCube(-0.3, -0.3, -0.3, 0.3, 0.3, 0.3)
p.rotate(Math.PI/3, Math.PI/6, 0);
p.render(canvasElement, {bgColor:'white'});
```

<img src="http://i.imgur.com/UewuE4L.jpg" width="300" height="300">

Add, rotate, and transform a circle:

```go
var p = pinhole.New();
p.drawCube(-0.3, -0.3, -0.3, 0.3, 0.3, 0.3)
p.rotate(Math.PI/3, Math.PI/6, 0);

p.begin()
p.drawCircle(0, 0, 0, 0.2)
p.rotate(0, math.Pi/2, 0)
p.translate(-0.6, -0.4, 0)
p.colorize("red");
p.end();

p.render(canvasElement, {bgColor:'white'});
```

<img src="http://i.imgur.com/UafJsKW.jpg" width="300" height="300">

## Contact

Josh Baker [@tidwall](http://twitter.com/tidwall)

## License

`pinhole` source code is available under the ISC [License](/LICENSE).

