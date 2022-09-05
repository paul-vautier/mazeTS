import {MazeController} from "./maze-controller.js";
import {EmptyGenerator} from "./generators/batch/empty-generator.js";
import { BFSSolver } from "./solvers/impl/bfs-solver.js";
import { Model } from "./model/model.js";
import { View } from "./view.js";

window.addEventListener("load", () => {
    let size = 4;
    let model = new Model();
    new EmptyGenerator().create(2*size + 1, model);
    let view = new View(model);

    let maze = new MazeController(size, model, view, new BFSSolver(model), new EmptyGenerator());
});