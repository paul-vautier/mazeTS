import { State } from "../../model/cell-state.js";
import { Indices } from "../../model/indices.js";
import { Model } from "../../model/model.js";
import { getRandomInt } from "../../util.js";
import { WallGenerator } from "../batch/wall-generator.js";
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";

export class RandomizedKruskal extends StrictBlockwiseGenerator {
    
    create(size : number, model: Model) : void {
        const grid = new WallGenerator().create(size);
        const visited: boolean[][] = new Array(size).fill(false)
            .map(() =>
                new Array(size).fill(false)
            );
        model.regenerate(grid);
        let x = getRandomInt(1, size/2) * 2 + 1;
        let y = getRandomInt(1, size/2) * 2 + 1;
        this.carve(x, y, model, visited);
    }

    private carve(x: number, y: number, model: Model, visited: boolean[][]) : void {
        let indices : Indices[];
        indices = [{x: x, y: y}];
        visited[x][y] = true;
        let candidatesAndOffsets: [Indices, Indices][]
        model.updateModel(x, y, State.UNVISITED_CELL);

        candidatesAndOffsets = this.getAllCandidates(indices, model, visited);
        
        while(candidatesAndOffsets.length) {

            let randIndex = getRandomInt(0, candidatesAndOffsets.length);
            let candidateAndOffset = candidatesAndOffsets.splice(randIndex, 1)[0];
            let candidate = candidateAndOffset[0];

            let offset = candidateAndOffset[1];
            indices.push(candidate);
            visited[candidate.x][candidate.y] = true;
            model.updateModel(candidate.x, candidate.y, State.UNVISITED_CELL);
            model.updateModel(offset.x, offset.y, State.UNVISITED_CELL);

            candidatesAndOffsets = this.getAllCandidates(indices, model, visited);
        }
    }

    private getAllCandidates(indices : Indices[], model: Model, visited: boolean[][]) {
        return indices.flatMap((index) => this.getCandidates(index.x, index.y, model.model, visited).map(offset=>{
            let tuple : [Indices, Indices]
            tuple = [
                {x: index.x + 2*offset.x, y: index.y + 2*offset.y},
                {x: index.x + offset.x, y: index.y + offset.y}
            ];
            return tuple;
        }));
    }
}