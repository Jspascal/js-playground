class Shape {
  constructor(renderer) {
    this.renderer = renderer;
  }

  draw() {
=    this.renderer.render();
  }
}

class Renderer {
  render() {
    throw new Error("This method must be overridden");
  }
}

class WebCanvasRenderer extends Renderer {
  render() {
    console.log("Drawing shape on web canvas");
  }
}

class SvgRenderer extends Renderer {
  render() {
    console.log("Drawing shape using SVG");
  }
}

class Circle extends Shape {
  draw() {
    console.log("Drawing a circle");
    super.draw();
  }
}

class Square extends Shape {
  draw() {
    console.log("Drawing a square");
    super.draw();
  }
}

const webCanvasCircle = new Circle(new WebCanvasRenderer());
webCanvasCircle.draw();

const svgSquare = new Square(new SvgRenderer());
svgSquare.draw();