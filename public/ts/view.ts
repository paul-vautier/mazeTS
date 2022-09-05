import { State } from "./model/cell-state.js";
import { ModelListener } from "./model/model-listener.js";
import { Model } from "./model/model.js";

const speed = 4;

export class View implements ModelListener{
    grid: HTMLElement[][];
    mazeParent : HTMLElement;
    eventsMap: Map<string, (x : number, y : number)=>void>
    eventPoll: {type: string, callback :()=>void}[]
    constructor(model : Model) {
        let mazeParent = document.getElementById("maze");
        if (!mazeParent) {
            throw Error("Couldn't find the #maze element");
        }
        this.mazeParent = mazeParent;
        this.mazeParent.dataset.size = model.model.length.toString();
        this.mazeParent.style.gridTemplateRows = `repeat(${model.model.length}, 1fr)`
        this.mazeParent.style.gridTemplateColumns = `repeat(${model.model.length}, 1fr)`
        this.grid = model.model.map((array, x) => array.map((state, y) => this.createDiv(state, x, y)));
        this.eventsMap = new Map();
        this.eventPoll = []

        this.pollEvents()
        model.addListener(this);
    }

    pollEvents() {
        let interval = setInterval(() => {
            if (this.eventPoll.length) {
                let polled = this.eventPoll.shift();
                polled?.callback();
                if ("reset" === polled?.type) {
                    clearInterval(interval)
                    setTimeout(()=> {
                        this.pollEvents();
                    }, 1000);
                }
            }
        }, speed);
    }

    onReset(model: State[][]): void {
        this.eventPoll = []
        this.eventPoll.push({
            type:"reset",
            callback: () => {
                this.destroy();
                this.mazeParent.dataset.size = model.length.toString();
                this.mazeParent.style.gridTemplateRows = `repeat(${model.length}, 1fr)`
                this.mazeParent.style.gridTemplateColumns = `repeat(${model.length}, 1fr)`
                this.grid = model.map((array, x) => array.map((state, y) => this.createDiv(state, x, y)));
                this.eventsMap.forEach((callback: (x : number, y : number)=>void, key: string) => {
                    this.grid.forEach((array, i) => array.forEach((cell, j)=> cell.addEventListener(key, ()=>callback(i,j))));
                })
            }
        })
    }

    onUpdate(x: number, y: number, state: State): void {
        this.eventPoll.push({
            type:"update",
            callback: () => {
                this.grid[x][y].classList.remove(State.BEGIN);
                this.grid[x][y].classList.remove(State.END);
                this.grid[x][y].classList.remove(State.WALL);
                this.grid[x][y].classList.remove(State.PATH);
                this.grid[x][y].classList.remove(State.UNVISITED_CELL);
                this.grid[x][y].classList.remove(State.VISITED_CELL);
                this.grid[x][y].classList.add(state);
                this.grid[x][y].classList.add('flip');
            }
        });
    }

    flipTransitionHandler(x: number, y: number) {
        this.grid[x][y].classList.remove("flip")
    }

    createDiv(state : State, x : number, y : number) : HTMLElement {
        let div = document.createElement("div");
        div.style.animationDelay = (10 * (x + y)).toString() + "ms";
        div.classList.add(state)
        let child = document.createElement("div");
        div.appendChild(child);
        this.mazeParent.appendChild(div);
        div.addEventListener("transitionend", () => this.flipTransitionHandler(x, y));
        return div
    }

    addEventListenerToEachCell(event : string, callback : (x : number, y : number)=>void) {
        this.eventsMap.set(event, callback);
        this.grid.forEach((array, i) => array.forEach((cell, j)=> cell.addEventListener(event, ()=>callback(i,j))));
    }

    destroy() {
        this.mazeParent.innerHTML = '';
    }
}