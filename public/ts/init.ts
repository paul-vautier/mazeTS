import {MazeController} from "./maze-controller.js";
import {EmptyGenerator} from "./generators/batch/empty-generator.js";
import { BFSSolver } from "./solvers/bfs-solver.js";
import { Model } from "./model/model.js";
import { View } from "./view.js";

window.addEventListener("load", () => {
    let size = 15;
    let model = new Model();
    model.regenerate(new EmptyGenerator().create(2*size + 1));
    let view = new View(model);

    let maze = new MazeController(size, model, view, new BFSSolver(model), new EmptyGenerator());
});