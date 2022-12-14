import { State } from "../model/cell-state.js";
import { Model } from "../model/model.js";
import { EventPollingView } from "./view.js";


export class ViewCanvas extends EventPollingView {
    ctx : CanvasRenderingContext2D;
    canvas : HTMLCanvasElement;
    rectWidth : number;
    rectHeight : number;

    constructor(model : Model) {
        super(model);
        
        if (!model.model.length || !model.model[0].length) {
            throw Error("Invalid grid");
        }
        this.canvas = document.createElement('canvas');
        this.mazeParent.appendChild(this.canvas);
        this.mazeParent.classList.add('canvas');
        this.canvas.width  = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.rectHeight = this.canvas.height / model.model[0].length;
        this.rectWidth = this.canvas.width / model.model.length;
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
        this.rectHeight = this.canvas.height / model[0].length;
        this.rectWidth = this.canvas.width / model.length;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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