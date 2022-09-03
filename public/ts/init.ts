import {NonSolver} from "./solvers/non-solver.js";
import {MazeController} from "./maze-controller.js";
import {EmptyGenerator} from "./generators/empty-generator.js";

window.addEventListener("load", () => {
    let maze = new MazeController(40, new NonSolver(), new EmptyGenerator());
});