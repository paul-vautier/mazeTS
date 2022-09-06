import { State } from "../../model/cell-state.js";
import { get2dArray, getRandomInt } from '../../util.js';
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";
import { WallGenerator } from "../batch/wall-generator.js";
/**
 * Recursive DFS generator.
 * Take a random node. While the node has candidates, randomly takes a candidate, carves a wall and recursively apply the same treatment to the candidate.
 * When the nodes has no more potential candidate to carve wall, backtrack to previous nodes to see if there are remaining candidates.
 * The generator stops when all the nodes have been explored.
 */
export class RecursiveDFSGenerator extends StrictBlockwiseGenerator {
    doCreate(size, model) {
        new WallGenerator().create(size, model);
        const visited = get2dArray(size, false);
        let x = getRandomInt(0, (size - 1) / 2) * 2 + 1;
        let y = getRandomInt(0, (size - 1) / 2) * 2 + 1;
        let updates = this.carve(x, y, model, visited);
        updates.push({ indices: { x: 1, y: 1 }, state: State.BEGIN });
        updates.push({ indices: { x: size - 2, y: size - 2 }, state: State.END });
        return updates;
    }
    constructor(size) {
        super(size);
    }
    carve(x, y, model, visited) {
        let updates;
        updates = [];
        if (visited[x][y]) {
            return updates;
        }
        visited[x][y] = true;
        let grid = model.model;
        updates.push({ indices: { x, y }, state: State.UNVISITED_CELL });
        let candidates = this.getCandidates(x, y, grid, visited);
        while (candidates.length) {
            let randIndex = getRandomInt(0, candidates.length);
            let candidate = candidates.splice(randIndex, 1)[0];
            // Checks a second time if the node has not been visited, which can occur after backtracking
            if (!visited[x + 2 * candidate.x][y + 2 * candidate.y]) {
                updates.push({ indices: { x: x + candidate.x, y: y + candidate.y }, state: State.UNVISITED_CELL });
                updates = updates.concat(this.carve(x + 2 * candidate.x, y + 2 * candidate.y, model, visited));
            }
        }
        return updates;
    }
}
