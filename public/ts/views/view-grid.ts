import { State } from "../model/cell-state.js";
import { Model } from "../model/model.js";
import { EventPollingView } from "./view.js";

const speed = 4;
const cellUpdateCount = 500;
export class ViewGrid extends EventPollingView{
    grid: HTMLElement[][];  
    constructor(model : Model) {
        super(model);
        this.grid = []
    }

    doOnReset(model: State[][]): void {
        this.destroy();
        this.mazeParent.dataset.size = model.length.toString();
        this.mazeParent.classList.add('grid');
        this.mazeParent.style.gridTemplateRows = `repeat(${model.length}, 1fr)`
        this.mazeParent.style.gridTemplateColumns = `repeat(${model.length}, 1fr)`
        this.grid = model.map((array, x) => array.map((state, y) => this.createDiv(state, x, y)));
        this.eventsMap.forEach((callback: (x : number, y : number)=>void, key: string) => {
            this.grid.forEach((array, i) => array.forEach((cell, j)=> cell.addEventListener(key, ()=>callback(i,j))));
        })
    }

    doOnUpdate(x: number, y: number, state: State): void {
        this.grid[x][y].classList.remove(State.BEGIN);
        this.grid[x][y].classList.remove(State.END);
        this.grid[x][y].classList.remove(State.WALL);
        this.grid[x][y].classList.remove(State.PATH);
        this.grid[x][y].classList.remove(State.UNVISITED_CELL);
        this.grid[x][y].classList.remove(State.VISITED_CELL);
        this.grid[x][y].classList.add(state);
        this.grid[x][y].classList.add('flip');
    }

    modelResetPolling(intervalId : number): boolean {
        clearInterval(intervalId)
        setTimeout(()=> {
            this.pollEvents();
        }, 1000);
        return false;
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
}