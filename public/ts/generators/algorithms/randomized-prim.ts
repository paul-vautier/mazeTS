import { State } from "../../model/cell-state.js";
import { Indices } from "../../model/indices.js";
import { Model } from "../../model/model.js";
import { get2dArray, getRandomInt } from "../../util.js";
import { WallGenerator } from "../batch/wall-generator.js";
import { StateUpdate } from "./state-update.js";
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";

/**
 * Uses Randomized prim algorithm.
 * As the graph is not weighted, it resorts to simply fetching all potential neighbours and taking one randomly
 */
export class RandomizedPrim extends StrictBlockwiseGenerator {
    
    doCreate(size : number, model: Model) : StateUpdate[] {
        new WallGenerator().create(size, model);
        const visited = get2dArray(size, false)
        let x = getRandomInt(0, (size-1)/2) * 2 + 1;
        let y = getRandomInt(0, (size-1)/2) * 2 + 1;
        let updates = this.carve(x, y, model, visited);

        updates.push({indices :{x:1, y:1}, state:State.BEGIN});
        updates.push({indices :{x: size-2, y: size-2}, state:State.END});
        return updates;
    }

    private carve(x: number, y: number, model: Model, visited: boolean[][]) : StateUpdate[] {
        let updates : StateUpdate[]
        updates = []

        visited[x][y] = true;
        let candidatesAndOffsets: {candidate : Indices, offset : Indices}[]
        updates.push({indices: {x, y}, state: State.UNVISITED_CELL})

        candidatesAndOffsets = this.getCandidatesAndOffset({x, y}, model, visited);

        while(candidatesAndOffsets.length) {
            let randIndex = getRandomInt(0, candidatesAndOffsets.length);
            let candidateAndOffset = candidatesAndOffsets.splice(randIndex, 1)[0];
            let candidate = candidateAndOffset.candidate;
            if (visited[candidate.x][candidate.y]) {
                continue;
            }
            let offset = candidateAndOffset.offset;
            visited[candidate.x][candidate.y] = true;

            updates.push({indices: {x: candidate.x, y: candidate.y}, state: State.UNVISITED_CELL})
            updates.push({indices: {x: offset.x, y: offset.y}, state: State.UNVISITED_CELL})

            candidatesAndOffsets.push(...this.getCandidatesAndOffset(candidate, model, visited));
        }
        return updates;
    }

    private getCandidatesAndOffset(indices : Indices, model: Model, visited: boolean[][]) {
        return this.getCandidates(indices.x, indices.y, model.model, visited).map(offset=>{
            let tuple = {
                candidate : {x: indices.x + 2*offset.x, y: indices.y + 2*offset.y},
                offset: {x: indices.x + offset.x, y: indices.y + offset.y}
            };
            return tuple;
        })
    }
}