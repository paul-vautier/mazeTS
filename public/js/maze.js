"use strict";
class MazeController {
    constructor(size) {
        this.size = size;
        this.grid = [];
        this.dragging = false;
        document.addEventListener("mousedown", () => this.dragging = true);
        document.addEventListener("mouseup", () => this.dragging = false);
        let mazeElement = document.getElementById("maze");
        if (!mazeElement) {
            throw Error("Couldn't find the #maze element");
        }
        this.mazeElement = mazeElement;
        this.mazeElement.dataset.size = size.toString();
        this.mazeElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        this.mazeElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < size; j++) {
                let div = document.createElement("div");
                div.style.animationDelay = (10 * (i + j)).toString() + "ms";
                div.classList.add("grow");
                mazeElement.appendChild(div);
                div.addEventListener("mouseover", () => this.toggleStateOnClickHandler(i, j));
                div.addEventListener("mousedown", () => this.toggleStateOnClickHandler(i, j, true));
                div.addEventListener("transitionend", () => this.flipTransitionHandler(i, j));
                this.grid[i].push([div, State.UNVISITED_CELL]);
                this.initState(i, j, State.UNVISITED_CELL);
            }
        }
    }
    flipTransitionHandler(x, y) {
        this.grid[x][y][0].classList.remove("flip");
        this.grid[x][y][0].classList.remove("grow");
    }
    toggleStateOnClickHandler(x, y, force) {
        if (!this.dragging && !force) {
            return;
        }
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            let currentElement = this.grid[x][y];
            if (currentElement[1] == State.WALL) {
                this.changeState(x, y, State.UNVISITED_CELL);
            }
            else if (currentElement[1] == State.UNVISITED_CELL) {
                this.changeState(x, y, State.WALL);
            }
        }
    }
    initState(x, y, state) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            let currentElement = this.grid[x][y];
            currentElement[1] = state;
            currentElement[0].classList.add(state);
        }
    }
    changeState(x, y, state) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            let currentElement = this.grid[x][y];
            currentElement[0].classList.remove(currentElement[1]);
            currentElement[1] = state;
            currentElement[0].classList.add(state);
            currentElement[0].classList.add("flip");
        }
    }
}
