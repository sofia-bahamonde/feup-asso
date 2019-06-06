(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
class CreateShapeAction {
    constructor(doc, shape) {
        this.doc = doc;
        this.shape = shape;
    }
    do() {
        this.doc.add(this.shape);
        return this.shape;
    }
    undo() {
        this.doc.objects = this.doc.objects.filter(o => o !== this.shape);
    }
}
class CreateTriangleAction extends CreateShapeAction {
    constructor(doc, x, y, x2, y2, x3, y3) {
        super(doc, new shape_1.Triangle(x, y, x2, y2, x3, y3));
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }
}
exports.CreateTriangleAction = CreateTriangleAction;
class CreateCircleAction extends CreateShapeAction {
    constructor(doc, x, y, radius) {
        super(doc, new shape_1.Circle(x, y, radius));
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}
exports.CreateCircleAction = CreateCircleAction;
class CreateRectangleAction extends CreateShapeAction {
    constructor(doc, x, y, width, height) {
        super(doc, new shape_1.Rectangle(x, y, width, height));
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
exports.CreateRectangleAction = CreateRectangleAction;
class TranslateAction {
    constructor(doc, shape, xd, yd) {
        this.doc = doc;
        this.shape = shape;
        this.xd = xd;
        this.yd = yd;
    }
    do() {
        this.oldX = this.shape.x;
        this.oldY = this.shape.y;
        this.shape.translate(this.xd, this.yd);
    }
    undo() {
        this.shape.x = this.oldX;
        this.shape.y = this.oldY;
        // this.shape.translate(-this.xd, -this.yd)
    }
}
exports.TranslateAction = TranslateAction;

},{"./shape":5}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
const undo_1 = require("./undo");
class SimpleDrawDocument {
    constructor() {
        this.objects = new Array();
        this.undoManager = new undo_1.UndoManager();
    }
    undo() {
        this.undoManager.undo();
    }
    redo() {
        this.undoManager.redo();
    }
    draw(render) {
        // this.objects.forEach(o => o.draw(ctx))
        render.draw(...this.objects);
    }
    add(r) {
        this.objects.push(r);
    }
    do(a) {
        this.undoManager.onActionDone(a);
        return a.do();
    }
    createRectangle(x, y, width, height) {
        return this.do(new actions_1.CreateRectangleAction(this, x, y, width, height));
    }
    createCircle(x, y, radius) {
        return this.do(new actions_1.CreateCircleAction(this, x, y, radius));
    }
    createTriangle(x, y, x2, y2, x3, y3) {
        return this.do(new actions_1.CreateTriangleAction(this, x, y, x2, y2, x3, y3));
    }
    translate(s, xd, yd) {
        return this.do(new actions_1.TranslateAction(this, s, xd, yd));
    }
}
exports.SimpleDrawDocument = SimpleDrawDocument;

},{"./actions":1,"./undo":6}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shape_1 = require("./shape");
class SVGRender {
    constructor() {
        this.svg = document.getElementById('svgcanvas');
    }
    draw(...objs) {
        for (const shape of objs) {
            if (shape instanceof shape_1.Rectangle) {
                const e = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                e.setAttribute('style', 'stroke: black; fill: white');
                e.setAttribute('x', shape.x.toString());
                e.setAttribute('y', shape.y.toString());
                e.setAttribute('width', shape.width.toString());
                e.setAttribute('height', shape.height.toString());
                this.svg.appendChild(e);
            }
            else if (shape instanceof shape_1.Circle) {
                const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                c.setAttribute('style', 'stroke: black; fill: white');
                c.setAttribute("cx", shape.x.toString());
                c.setAttribute("cy", shape.y.toString());
                c.setAttribute("r", shape.radius.toString());
                this.svg.appendChild(c);
            }
        }
    }
}
exports.SVGRender = SVGRender;
class CanvasRender {
    constructor() {
        const canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
    }
    draw(...objs) {
        for (const shape of objs) {
            if (shape instanceof shape_1.Circle) {
                this.ctx.ellipse(shape.x, shape.y, shape.radius, shape.radius, 0, 0, 2 * Math.PI);
                this.ctx.stroke();
            }
            else if (shape instanceof shape_1.Rectangle) {
                this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            }
            else if (shape instanceof shape_1.Triangle) {
                this.ctx.moveTo(shape.x, shape.y);
                this.ctx.lineTo(shape.x2, shape.y2);
                this.ctx.lineTo(shape.x3, shape.y3);
                this.ctx.lineTo(shape.x, shape.y);
                this.ctx.stroke();
            }
        }
    }
}
exports.CanvasRender = CanvasRender;

},{"./shape":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("./document");
const render_1 = require("./render");
const canvasrender = new render_1.CanvasRender();
const svgrender = new render_1.SVGRender();
const sdd = new document_1.SimpleDrawDocument();
const c1 = sdd.createCircle(100, 100, 30);
const r1 = sdd.createRectangle(10, 10, 80, 80);
const r2 = sdd.createRectangle(30, 30, 40, 40);
const t1 = sdd.createTriangle(100, 100, 200, 400, 300, 200);
/* const s1 = sdd.createSelection(c1, r1, r2)
sdd.translate(s1, 10, 10) */
console.log("Hello in Script.ts");
sdd.draw(canvasrender);
sdd.draw(svgrender);

},{"./document":2,"./render":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    translate(xd, yd) {
        this.x += xd;
        this.y += yd;
    }
}
exports.Shape = Shape;
class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
exports.Rectangle = Rectangle;
class Circle extends Shape {
    constructor(x, y, radius) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}
exports.Circle = Circle;
class Triangle extends Shape {
    constructor(x, y, x2, y2, x3, y3) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }
}
exports.Triangle = Triangle;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UndoManager {
    constructor() {
        this.doStack = new Array();
        this.undoStack = new Array();
    }
    undo() {
        if (this.doStack.length > 0) {
            const a1 = this.doStack.pop();
            a1.undo();
            this.undoStack.push(a1);
        }
    }
    redo() {
        if (this.undoStack.length > 0) {
            const a1 = this.undoStack.pop();
            a1.do();
            this.doStack.push(a1);
        }
    }
    onActionDone(a) {
        this.doStack.push(a);
        this.undoStack.length = 0;
    }
}
exports.UndoManager = UndoManager;

},{}]},{},[4]);