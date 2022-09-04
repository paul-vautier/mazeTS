import { View } from "./view.js";
import { State } from "./model/cell-state.js";
import { MazeSolver } from "./solvers/maze-solver.js";
import { MazeGenerator } from "./generators/algorithms/maze-generator.js";
import { Model } from "./model/model.js";
import { WallGenerator } from "./generators/batch/wall-generator.js";
import { EmptyGenerator } from "./generators/batch/empty-generator.js";
import { RecursiveDFSGenerator } from "./generators/algorithms/recurse-dfs-generator.js";

export class MazeController {
    view: View;
    model: Model;
    size: number;
    begin: {x:number, y:number} | undefined;
    end: {x:number, y:number} | undefined;
    dragging: boolean;
    solver: MazeSolver;
    generator: MazeGenerator;
    selectedState: State;
    constructor(size: number, solver: MazeSolver, generator: MazeGenerator) {
        this.size = 2*size+1;
        this.dragging = false
        this.generator = generator;
        document.addEventListener("mousedown", () => this.dragging = true)
        document.addEventListener("mouseup", () => this.dragging = false)

        this.model = new Model(generator);
        this.model.regenerate(new EmptyGenerator().create(this.size));
        this.view = new View(this.model);

        this.view.addEventListenerToEachCell("mouseover", (x, y) => this.toggleStateOnClickHandler(x, y));
        this.view.addEventListenerToEachCell("mousedown", (x, y) => this.toggleStateOnClickHandler(x, y, true));
        
        this.solver = solver;
        solver.setOnCellUpdate(this.changeState.bind(this));

        solver.solve()
        this.addTileChangeEvent();
        this.addToggleCommandPanel();
        this.addGeneratorChangeEvent("dfs", () => {
            return new RecursiveDFSGenerator(this.size)
        })
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
            let state = this.model.model[x][y];
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
            this.model.model[x][y] = state;
        }
    }

    changeState(x: number, y: number, state: State) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0 && state != this.model.model[x][y]) {
            this.view.grid[x][y].classList.remove(this.model.model[x][y]);
            this.view.grid[x][y].classList.add(state);
            this.model.model[x][y] = state;
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

    addGeneratorChangeEvent(id: string, generatorProvider: ()=> MazeGenerator) {
        document.getElementById(id)?.addEventListener('click', ()=> {
            console.log('dsdsd')
            generatorProvider().create(this.size, this.model);
        })
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