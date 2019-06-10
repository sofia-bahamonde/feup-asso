"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("./actions");
const undo_1 = require("./undo");
class SimpleDrawDocument {
    constructor() {
        this.objects = new Array();
        this.undoManager = new undo_1.UndoManager();
        // translate(s: Shape, xd: number, yd: number): void {
        //     return this.do(new TranslateAction(this, s, xd, yd))
        // }
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
    createRectangle(points, width, height) {
        return this.do(new actions_1.CreateRectangleAction(this, points, width, height));
    }
    createCircle(points, radius) {
        return this.do(new actions_1.CreateCircleAction(this, points, radius));
    }
    createTriangle(points) {
        return this.do(new actions_1.CreateTriangleAction(this, points));
    }
    createPolygon(points) {
        return this.do(new actions_1.CreatePolygonAction(this, points));
    }
}
exports.SimpleDrawDocument = SimpleDrawDocument;
//# sourceMappingURL=document.js.map