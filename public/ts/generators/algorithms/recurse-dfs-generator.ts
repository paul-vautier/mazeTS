import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";
import { get2dArray, getRandomInt } from '../../util.js';
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";
import { WallGenerator } from "../batch/wall-generator.js";

export class RecursiveDFSGenerator extends StrictBlockwiseGenerator {
    constructor(size: number) {
        super(size);
    }

    create(size : number, model: Model) : void {
        const grid = new WallGenerator().create(size);
        const visited = get2dArray(size, false);
        let x = getRandomInt(0, size/2) * 2 + 1;
        let y = getRandomInt(0, size/2) * 2 + 1;
        model.regenerate(grid)
        this.carve(x, y, model, visited);
        model.updateModel(1,1, State.BEGIN);
        model.updateModel(size-2,size-2, State.END);
    }

    private carve(x: number, y: number, model: Model, visited: boolean[][]) {
        if (visited[x][y]) {
            return;
        }
        visited[x][y] = true;
        let grid = model.model;
        model.updateModel(x, y, State.UNVISITED_CELL)
        let candidates = this.getCandidates(x, y, grid, visited);
        while(candidates.length) {
            let randIndex = getRandomInt(0, candidates.length);
            let candidate = candidates.splice(randIndex, 1)[0]
            if (!visited[x + 2 * candidate.x][y + 2 * candidate.y]) {
                model.updateModel(x + candidate.x, y + candidate.y, State.UNVISITED_CELL)
                this.carve(x + 2 * candidate.x, y + 2 * candidate.y, model, visited);
            }
        }
    }
}