import { Shape } from "shape";

/*
    Tool is going to be instanced using factory design pattern and each has the virtual method action()
    that takes a object argument that contains its parameters
*/

export class ActionParam{
    constructor(public points:Array<Array<number>>, public objects_sel: Array<Shape>){
    }

}

export abstract class Tool{
    constructor(public name:String, public img_loc:String ) {
    }

    action(action_para:ActionParam) : boolean{
        return false;
    }

}


export class MoveTool extends Tool{
    
    action(action_para:ActionParam) : boolean{
        
        console.log("On Move Tool")
        action_para.objects_sel.forEach(element => {

            try{

                for (let i = 0; i < element.points.length; i++) {
                    
                    if(i%2)
                        element.points[i] += action_para.points[action_para.points.length -1][0]
                    else
                        element.points[i] += action_para.points[action_para.points.length -1][1]
                }
            } catch(e){
                console.log("Error on MoveTool")
                return false;
            }
        });

        return true;
    }
}

export class PaintTool extends Tool{

    public color:String = "Blue"

    constructor(color:String, public name:String, public img_loc:String ){
        super(name, img_loc)
    }

    action(action_para:ActionParam) : boolean{
        action_para.objects_sel.forEach(element => {

            try{
            element.color = this.color
            } catch(e){
                console.log("Error on PaintTool")
                return false;
            }
        });

        return true;
    }
}