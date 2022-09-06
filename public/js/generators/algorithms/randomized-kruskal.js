import { State } from "../../model/cell-state.js";
import { get2dArray, getRandomInt } from "../../util.js";
import { WallGenerator } from "../batch/wall-generator.js";
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";
/**
 * Uses Randomized Kruskal algorithm.
 * As the graph is not weighted, it resorts to simply fetching all potential neighbours and taking one randomly
 */
export class RandomizedKruskal extends StrictBlockwiseGenerator {
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
    carve(x, y, model, visited) {
        let indices;
        let updates;
        updates = [];
        indices = [{ x: x, y: y }];
        visited[x][y] = true;
        let candidatesAndOffsets;
        updates.push({ indices: { x, y }, state: State.UNVISITED_CELL });
        candidatesAndOffsets = this.getAllCandidates(indices, model, visited);
        while (candidatesAndOffsets.length) {
            let randIndex = getRandomInt(0, candidatesAndOffsets.length);
            let candidateAndOffset = candidatesAndOffsets.splice(randIndex, 1)[0];
            let candidate = candidateAndOffset[0];
            let offset = candidateAndOffset[1];
            indices.push(candidate);
            visited[candidate.x][candidate.y] = true;
            updates.push({ indices: { x: candidate.x, y: candidate.y }, state: State.UNVISITED_CELL });
            updates.push({ indices: { x: offset.x, y: offset.y }, state: State.UNVISITED_CELL });
            candidatesAndOffsets = this.getAllCandidates(indices, model, visited);
        }
        return updates;
    }
    getAllCandidates(indices, model, visited) {
        return indices.flatMap((index) => this.getCandidates(index.x, index.y, model.model, visited).map(offset => {
            let tuple;
            tuple = [
                { x: index.x + 2 * offset.x, y: index.y + 2 * offset.y },
                { x: index.x + offset.x, y: index.y + offset.y }
            ];
            return tuple;
        }));
    }
}
