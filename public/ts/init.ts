import {MazeController} from "./maze-controller.js";
import {EmptyGenerator} from "./generators/batch/empty-generator.js";
import { BFSSolver } from "./solvers/impl/bfs-solver.js";
import { Model } from "./model/model.js";
import { ViewGrid } from "./views/view-grid.js";
import { ViewCanvas } from "./views/view-canvas.js";

window.addEventListener("load", () => {
    let size = 50;
    let model = new Model();
    new EmptyGenerator().create(2*size + 1, model);
    let view = new ViewCanvas(model);

    new MazeController(model, view, new BFSSolver(model), new EmptyGenerator());
});