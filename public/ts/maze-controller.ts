import { MazeGenerator } from "./generators/maze-generator.js";
import { RandomizedPrim } from "./generators/algorithms/randomized-prim.js";
import { RecursiveDFSGenerator } from "./generators/algorithms/recurse-dfs-generator.js";
import { State } from "./model/cell-state.js";
import { Model } from "./model/model.js";
import { BFSSolver } from "./solvers/impl/bfs-solver.js";
import { MazeSolver } from "./solvers/maze-solver.js";
import { AstarSolver } from "./solvers/impl/astar-solver.js";
import { EventPollingView } from "./views/view.js";
import { BinaryTreeGenerator } from "./generators/algorithms/binary-tree.js";

export class MazeController {
    view: EventPollingView;
    model: Model;
    size: number;
    dragging: boolean;
    solver: MazeSolver;
    generator: MazeGenerator;
    selectedState: State;
    constructor(model: Model, view: EventPollingView, solver: MazeSolver, generator: MazeGenerator) {
        this.size = model.model.length;
        this.dragging = false
        this.generator = generator;
        document.addEventListener("mousedown", () => this.dragging = true)
        document.addEventListener("mouseup", () => this.dragging = false)
        this.view = view;
        this.model = model;

        this.view.addEventListenerToEachCell("mousemove", (x, y) => this.toggleStateOnClickHandler(x, y));
        this.view.addEventListenerToEachCell("mousedown", (x, y) => this.toggleStateOnClickHandler(x, y, true));

        this.solver = solver;

        this.addTileChangeEvent();
        this.addToggleCommandPanel();
        this.addGeneratorChangeEvent("dfs", () => {
            return new RecursiveDFSGenerator(this.size)
        })

        this.addGeneratorChangeEvent("prim", () => {
            return new RandomizedPrim(this.size)
        })

        this.addGeneratorChangeEvent("btree", () => {
            return new BinaryTreeGenerator(this.size)
        })

        this.addSolverChangeEvent("bfs", () => {
            return new BFSSolver(this.model);
        }); 

        this.addSolverChangeEvent("astar", () => {
            return new AstarSolver(this.model);
        }); 

        document.getElementById("refreshCount")?.addEventListener("change", event => this.view.changeRefreshCount((<HTMLInputElement>event.target).valueAsNumber))
        document.getElementById("refreshRate")?.addEventListener("change", event => this.view.changeRefreshRate(Math.floor(1000 / (<HTMLInputElement>event.target).valueAsNumber)))
        
        let sizeElement = document.getElementById("size")
        if (sizeElement instanceof HTMLInputElement) {
            sizeElement.value = Math.floor(this.size / 2).toString() 
        }
        

        document.getElementById("size")?.addEventListener("change", event => this.size = 2*(<HTMLInputElement>event.target).valueAsNumber + 1)

        this.selectedState = State.UNVISITED_CELL;
        this.model.regenerate(this.model.model)
    }

    destroyMaze() {
        this.view.destroy();
    }

    toggleStateOnClickHandler(x: number, y: number, force?: boolean) {
        if (!this.dragging && !force) {
            return
        }
        this.changeState(x, y, this.selectedState);
    }

    initState(x: number, y: number, state: State) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            this.model.updateModel(x, y, state);
        }
    }

    changeState(x: number, y: number, state: State) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0 && state != this.model.model[x][y]) {
            this.model.updateModel(x, y, state);
        }
    }

    setSolver(solverProvider: (model: Model)=>MazeSolver) {
        this.solver = solverProvider(this.model);
    }

    addTileChangeEvent() {
        document.querySelectorAll('.tile[data-tile]').forEach((elt) => {
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
            generatorProvider().create(this.size, this.model);
        })
    }

    addSolverChangeEvent(id: string, solverProvider: ()=> MazeSolver) {
        document.getElementById(id)?.addEventListener('click', () => {
            if (this.model.begin) {
                solverProvider().solve(this.model.begin.x, this.model.begin.y);
            }
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