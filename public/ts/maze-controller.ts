import { View } from "./view.js";
import { State } from "./cell-state.js";
import { MazeSolver } from "./solvers/maze-solver.js";
import { MazeGenerator } from "./generators/maze-generator.js";

export class MazeController {
    view: View;
    model: State[][];
    size: number;
    begin: [number, number] | undefined;
    end: [number, number] | undefined;
    dragging: boolean;
    solver: MazeSolver;
    generator: MazeGenerator;
    selectedState: State;
    constructor(size: number, solver: MazeSolver, generator: MazeGenerator) {
        this.size = size;
        this.dragging = false
        this.generator = generator;
        document.addEventListener("mousedown", () => this.dragging = true)
        document.addEventListener("mouseup", () => this.dragging = false)

        this.model = generator.create(size);

        this.view = new View(  this.model);

        this.view.addEventListenerToEachCell("mouseover", (x, y) => this.toggleStateOnClickHandler(x, y));
        this.view.addEventListenerToEachCell("mousedown", (x, y) => this.toggleStateOnClickHandler(x, y, true));

        this.solver = solver;
        solver.setOnCellUpdate(this.changeState.bind(this));

        solver.solve()
        this.addTileChangeEvent();
        this.addToggleCommandPanel();

        this.selectedState = State.UNVISITED_CELL;
    }

    destroyMaze() {
        this.view.destroy();
    }

    toggleStateOnClickHandler(x: number, y: number, force?: boolean) {
        if (!this.dragging && !force) {
            return
        }
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            let state = this.model[x][y];
            if (state == this.selectedState) {
                this.changeState(x, y, State.UNVISITED_CELL);
            } else if (state != this.selectedState) {
                this.changeState(x, y, this.selectedState);
            }
        }
    }

    initState(x: number, y: number, state: State) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            this.view.grid[x][y].classList.add(state);
            this.model[x][y] = state;
        }
    }

    changeState(x: number, y: number, state: State) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0 && state != this.model[x][y]) {
            this.view.grid[x][y].classList.remove(this.model[x][y]);
            this.view.grid[x][y].classList.add(state);
            this.model[x][y] = state;
            this.view.grid[x][y].classList.add("flip");
        }
    }

    setSolver(solver: MazeSolver) {
        this.solver = solver;
        solver.setOnCellUpdate(this.changeState.bind(this));
    }

    addTileChangeEvent() {
        document.querySelectorAll('#tiles>li>ul>.tile[data-tile]').forEach((elt) => {
            if (elt instanceof HTMLElement) {
                elt.addEventListener("click", () => {
                    if (elt.dataset.tile) {
                        this.changeSelectedState("maze-"+elt.dataset.tile);
                    }
                });
            }
        });
    }

    changeSelectedState(state: string) {
        const indexOfState = Object.values(State).indexOf(state as unknown as State);
        if (indexOfState !== -1) {
            this.selectedState = (<any>State)[Object.keys(State)[indexOfState]];
        }
    }

    addToggleCommandPanel() {
        let panel = document.getElementById("tiles");
        if (!panel) {
            return;
        }

        document.querySelectorAll('.expand')?.forEach(element => {
            let expandHtml = (<HTMLElement> element)
            expandHtml.addEventListener('click', ()=> {
                if (expandHtml.dataset.expand) {
                    let panel = document.getElementById(expandHtml.dataset.expand);
                    if (!panel) {
                        return;
                    }
                    panel?.classList.toggle("shrunk");                
                }
            })
        });
    }

}