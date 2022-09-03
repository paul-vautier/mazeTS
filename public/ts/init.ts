import {RandomSolver} from "./solvers/non-solver.js";
import {MazeController} from "./maze-controller.js";
import {EmptyGenerator} from "./generators/empty-generator.js";

window.addEventListener("load", () => {
    let maze = new MazeController(10, new RandomSolver(), new EmptyGenerator());
});