import { RandomizedKruskal } from "./generators/algorithms/randomized-kruskal.js";
import { RecursiveDFSGenerator } from "./generators/algorithms/recurse-dfs-generator.js";
import { State } from "./model/cell-state.js";
import { BFSSolver } from "./solvers/impl/bfs-solver.js";
import { AstarSolver } from "./solvers/impl/astar-solver.js";
export class MazeController {
    constructor(size, model, view, solver, generator) {
        this.size = 2 * size + 1;
        this.dragging = false;
        this.generator = generator;
        document.addEventListener("mousedown", () => this.dragging = true);
        document.addEventListener("mouseup", () => this.dragging = false);
        this.view = view;
        this.model = model;
        this.view.addEventListenerToEachCell("mouseover", (x, y) => this.toggleStateOnClickHandler(x, y));
        this.view.addEventListenerToEachCell("mousedown", (x, y) => this.toggleStateOnClickHandler(x, y, true));
        this.solver = solver;
        this.addTileChangeEvent();
        this.addToggleCommandPanel();
        this.addGeneratorChangeEvent("dfs", () => {
            return new RecursiveDFSGenerator(this.size);
        });
        this.addGeneratorChangeEvent("kruskal", () => {
            return new RandomizedKruskal(this.size);
        });
        this.addSolverChangeEvent("bfs", () => {
            return new BFSSolver(this.model);
        });
        this.addSolverChangeEvent("astar", () => {
            return new AstarSolver(this.model);
        });
        this.selectedState = State.UNVISITED_CELL;
    }
    destroyMaze() {
        this.view.destroy();
    }
    toggleStateOnClickHandler(x, y, force) {
        if (!this.dragging && !force) {
            return;
        }
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            if (this.model.model[x][y] == State.END || this.model.model[x][y] == State.BEGIN) {
                return;
            }
            let state = this.model.model[x][y];
            if (state != this.selectedState) {
                this.changeState(x, y, this.selectedState);
            }
        }
    }
    initState(x, y, state) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0) {
            this.view.grid[x][y].classList.add(state);
            this.model.model[x][y] = state;
        }
    }
    changeState(x, y, state) {
        if (y >= 0 && y < this.size && x < this.size && x >= 0 && state != this.model.model[x][y]) {
            this.view.grid[x][y].classList.remove(this.model.model[x][y]);
            this.view.grid[x][y].classList.add(state);
            this.model.updateModel(x, y, state);
            this.view.grid[x][y].classList.add("flip");
        }
    }
    setSolver(solverProvider) {
        this.solver = solverProvider(this.model);
    }
    addTileChangeEvent() {
        document.querySelectorAll('#tiles>li>ul>.tile[data-tile]').forEach((elt) => {
            if (elt instanceof HTMLElement) {
                elt.addEventListener("click", () => {
                    if (elt.dataset.tile) {
                        this.changeSelectedState("maze-" + elt.dataset.tile);
                    }
                });
            }
        });
    }
    addGeneratorChangeEvent(id, generatorProvider) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            generatorProvider().create(this.size, this.model);
        });
    }
    addSolverChangeEvent(id, solverProvider) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
            if (this.model.begin) {
                solverProvider().solve(this.model.begin.x, this.model.begin.y);
            }
        });
    }
    changeSelectedState(state) {
        const indexOfState = Object.values(State).indexOf(state);
        if (indexOfState !== -1) {
            this.selectedState = State[Object.keys(State)[indexOfState]];
        }
    }
    addToggleCommandPanel() {
        var _a;
        let panel = document.getElementById("tiles");
        if (!panel) {
            return;
        }
        (_a = document.querySelectorAll('.expand')) === null || _a === void 0 ? void 0 : _a.forEach(element => {
            let expandHtml = element;
            expandHtml.addEventListener('click', () => {
                if (expandHtml.dataset.expand) {
                    let panel = document.getElementById(expandHtml.dataset.expand);
                    if (!panel) {
                        return;
                    }
                    panel === null || panel === void 0 ? void 0 : panel.classList.toggle("shrunk");
                }
            });
        });
    }
}
