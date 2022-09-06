import { State } from "../model/cell-state.js";
import { getRandomInt } from '../util.js';
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";
import { WallGenerator } from "./wall-generator.js";
class RecursiveDFSGenerator extends StrictBlockwiseGenerator {
    constructor(size) {
        super(size);
    }
    create(size, model) {
        const grid = new WallGenerator().create(this.size);
        const visited = new Array(this.size).fill(false)
            .map(() => new Array(this.size).fill(false));
        let x = getRandomInt(1, this.size);
        let y = getRandomInt(1, this.size);
        this.carve(x, y, grid, visited);
    }
    carve(x, y, model, visited) {
        if (visited[x][y]) {
            return;
        }
        visited[x][y] = true;
        grid[x][y] = State.
        ;
        let candidates = this.getCandidates(x, y, grid, visited);
        while (candidates.length) {
            let candidate = candidates[getRandomInt(0, candidates.length)];
            grid[x + candidate.x][candi];
        }
    }
}
