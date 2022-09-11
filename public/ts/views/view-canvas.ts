import { State } from "../model/cell-state.js";
import { Model } from "../model/model.js";
import { EventPollingView } from "./view.js";


export class ViewCanvas extends EventPollingView {
    ctx : CanvasRenderingContext2D;
    canvas : HTMLCanvasElement;
    width : number = 800;
    height : number = 800;
    rectWidth : number;
    rectHeight : number;

    constructor(model : Model) {
        super(model);
        
        if (!model.model.length || !model.model[0].length) {
            throw Error("Invalid grid");
        }
        this.rectHeight = this.height / model.model[0].length;
        this.rectWidth = this.width / model.model.length;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('height', this.height.toString())
        this.canvas.setAttribute('width', this.width.toString())
        this.mazeParent.appendChild(this.canvas);
        let ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw Error("Couldn't get a canvas 2d context");
        }
        this.ctx = ctx;
    }

    doOnReset(model: State[][]): void {
        if (!model.length || !model[0].length) {
            throw Error("Invalid grid");
        }
        this.rectHeight = this.height / model[0].length;
        this.rectWidth = this.width / model.length;
        this.ctx.clearRect(0, 0, this.width, this.height);
        model.forEach((array, x)=> {
            array.forEach((state, y)=> {
                this.ctx.fillStyle = this.getColor(state);
                this.ctx.fillRect(x*this.rectWidth, y*this.rectHeight, this.rectWidth, this.rectHeight)
            })
        })
    }

    doOnUpdate(x: number, y: number, state: State): void {
        this.ctx.fillStyle = this.getColor(state);
        this.ctx.fillRect(x*this.rectWidth, y*this.rectHeight, this.rectWidth, this.rectHeight);
    }

    addEventListenerToEachCell(event: string, callback: (x: number, y: number) => void): void {
        this.canvas.addEventListener(event, (event)=> {
            if (!(event instanceof MouseEvent)) {
                throw Error("Event must be a mouse event")
            }
            let rect = this.canvas.getBoundingClientRect();
            let indexX = Math.floor((event.clientX  - rect.left) / this.rectWidth);
            let indexY = Math.floor((event.clientY  - rect.top) / this.rectHeight);
            callback(indexX, indexY);
        });
    }

    getColor(state : State) : string {
        switch (state) {
            case State.BEGIN:
            case State.END:
                return getComputedStyle(document.documentElement).getPropertyValue("--goal")
            case State.PATH:
                return getComputedStyle(document.documentElement).getPropertyValue("--path")
            case State.UNVISITED_CELL:
                return getComputedStyle(document.documentElement).getPropertyValue("--tile")
            case State.VISITED_CELL:
                return getComputedStyle(document.documentElement).getPropertyValue("--visited")
            case State.WALL:
                return getComputedStyle(document.documentElement).getPropertyValue("--wall")
        }
    }

}