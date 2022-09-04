import {RandomSolver} from "./solvers/non-solver.js";
import {MazeController} from "./maze-controller.js";
import {EmptyGenerator} from "./generators/batch/empty-generator.js";

window.addEventListener("load", () => {
    let maze = new MazeController(20, new RandomSolver(), new EmptyGenerator());
});