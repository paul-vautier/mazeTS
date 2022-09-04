import { State } from "./cell-state.js";

export class View {
    grid: HTMLElement[][];
    mazeParent : HTMLElement;
    constructor(model : State[][]) {
        let mazeParent = document.getElementById("maze");
        if (!mazeParent) {
            throw Error("Couldn't find the #maze element");
        }
        this.mazeParent = mazeParent;
        this.mazeParent.dataset.size = model.length.toString();
        this.mazeParent.style.gridTemplateRows = `repeat(${model.length}, 1fr)`
        this.mazeParent.style.gridTemplateColumns = `repeat(${model.length}, 1fr)`

        this.grid = model.map((array, x) => array.map((state, y) => this.createDiv(state, x, y)));
    }


    flipTransitionHandler(x: number, y: number) {
        this.grid[x][y].classList.remove("flip")
        // this.grid[x][y].classList.remove("grow")
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
        this.grid.forEach((array, i) => array.forEach((cell, j)=> cell.addEventListener(event, ()=>callback(i,j))));
    }

    destroy() {
        this.mazeParent.innerHTML = '';
    }
}