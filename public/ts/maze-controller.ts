import { View } from "./view.js";
import { State } from "./cell-state.js";
import { MazeSolver } from "./solvers/maze-solver.js";
import { MazeGenerator } from "./generators/maze-generator.js";

export class MazeController {
    view : View;
    model: State[][];
    size: number;
    begin: [number, number] | undefined;
    end: [number, number] | undefined;
    mazeElement: HTMLElement;
    dragging : boolean;
    solver : MazeSolver;
    generator : MazeGenerator;
    constructor(size: number, solver : MazeSolver, generator : MazeGenerator) {
        this.size = size;
        this.dragging = false
        this.solver = solver;
        this.generator = generator;
        document.addEventListener("mousedown", () => this.dragging = true)
        document.addEventListener("mouseup", () => this.dragging = false)
        let mazeElement = document.getElementById("maze");
        if (!mazeElement) {
            throw Error("Couldn't find the #maze element");
        }
        this.mazeElement = mazeElement;
        this.mazeElement.dataset.size = size.toString();
        this.mazeElement.style.gridTemplateRows = `repeat(${size}, 1fr)`
        this.mazeElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`
        
        this.model = generator.create(size);

        this.view = new View(this.mazeElement, this.model);

        this.view.addEventListenerToEachCell("mouseover", (x, y) => this.toggleStateOnClickHandler(x,y))
        this.view.addEventListenerToEachCell("mousedown", (x, y) => this.toggleStateOnClickHandler(x, y, true))
    }

    toggleStateOnClickHandler(x: number, y: number, force? : boolean) {
        if (!this.dragging && !force) {
            return
        }
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            let state = this.model[x][y];
            if (state == State.WALL) {
                this.changeState(x, y, State.UNVISITED_CELL);
            } else if (state == State.UNVISITED_CELL) {
                this.changeState(x, y, State.WALL);
            }
            this.view.grid[x][y].classList.add("flip");
        }
    }

    initState(x: number, y: number, state: State) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            this.view.grid[x][y].classList.add(state);
            this.model[x][y] = state;
        }
    }

    changeState(x: number, y: number, state: State) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            this.view.grid[x][y].classList.remove(this.model[x][y]);
            this.view.grid[x][y].classList.add(state);
            this.model[x][y] = state;
        }
    }
}