import { SimpleDrawDocument } from './document'
import { CanvasRender, SVGRender, InterfaceRender, WireFrameAPI } from './render';
import {Interpreter} from './interperter';
import { ToolBox } from './toolbox';
import { MoveTool, PaintTool } from './tool';
import { Layers } from './layer';
import { BMP, XML, FileIO } from './fileio';

const sdd = new SimpleDrawDocument(update)

const canvasrender = new CanvasRender(new WireFrameAPI())
const svgrender = new SVGRender()
const uirender = new InterfaceRender()

function update(){
    sdd.draw(canvasrender)
    sdd.draw(svgrender)
    sdd.drawUI(uirender)
}

var toolbox = new ToolBox()

const movetool = new MoveTool("Move Tool", "movetool.png")
const painttool = new PaintTool("Red", "Paint Tool", "painttool.png")

toolbox.add(movetool)
toolbox.add(painttool)

sdd.addUIElem(toolbox)

const layerui = new Layers()
layerui.addLayernew()
layerui.addLayernew()
layerui.addLayernew()

sdd.addUIElem(layerui)

var consoleBtn = <HTMLButtonElement> document.getElementById("submit");
var undoBtn = <HTMLButtonElement> document.getElementById("undo");
var redoBtn = <HTMLButtonElement> document.getElementById("redo");

var importbtn = <HTMLButtonElement> document.getElementById("import");
var exportbtn = <HTMLButtonElement> document.getElementById("export");
var format_box = <HTMLButtonElement> document.getElementById("format-dropbox")

var input = <HTMLInputElement> document.getElementById("console-input");


consoleBtn.addEventListener("click", () => {
    let command : string = input.value;
    let context :Interpreter.Context = new Interpreter.Context(sdd, canvasrender, svgrender, command); 
    let expression : Interpreter.CommandExpression = new Interpreter.CommandExpression(command[0]);
    expression.interpret(context)
});

undoBtn.addEventListener("click", () => {
    sdd.undo();
    update()
});

redoBtn.addEventListener("click", () => {
    sdd.redo();
    update()
});

var BMPexp = new BMP(100, 100)
var XMLexp = new XML()

var option = document.createElement("OPTION");
option.setAttribute("value","BMP");
option.innerHTML = "BMP";
format_box.appendChild(option);

var option = document.createElement("OPTION");
option.setAttribute("value","XML");
option.innerHTML = "XML";
format_box.appendChild(option);

function retFileIO(name:String): FileIO{
    
    if(name == "BMP")
        return BMPexp
    else if (name == "XML")
        return XMLexp
    
    return null
}

importbtn.addEventListener("click", () => {

    sdd.import(retFileIO(format_box.value));
    update()
});

exportbtn.addEventListener("click", () => {
    sdd.export(retFileIO(format_box.value));
});

function getCursorPosition(canvas:HTMLCanvasElement, event:MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return [x,y]
}

const canvas = document.querySelector('canvas')
canvas.addEventListener('mousedown', function(e) {
    const pos = getCursorPosition(canvas, e)
    sdd.canvasNotification(pos[0], pos[1])
})

export function clicked_tool(tool_name:String){
    console.log("on script.ts clicked tool")
    sdd.clicked_tool(tool_name)
}


update()
sdd.setToolListeners()
