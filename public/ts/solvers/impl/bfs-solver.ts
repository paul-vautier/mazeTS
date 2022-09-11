import { StateUpdate } from "../../generators/algorithms/state-update.js";
import { ClearedMazeGenerator } from "../../generators/batch/cleared-maze-generator.js";
import { State } from "../../model/cell-state.js";
import { Indices } from "../../model/indices.js";
import { Model } from "../../model/model.js";
import { get2dArray } from "../../util.js";
import { MazeSolver } from "../maze-solver.js";

export class BFSSolver extends MazeSolver {
    constructor(model: Model) {
        super(model)
    }

    doSolve(x: number, y:number): [StateUpdate[], Indices[]] {
        new ClearedMazeGenerator().create(this.model.model.length, this.model);
        let queue : [Indices, Indices[]][]
        let updates : StateUpdate[] = [];
        queue = [[{x: x, y: y}, []]];
        let visited = get2dArray(this.model.model.length, false);
        while(queue.length) {
            let current = queue.shift();
            if(!current) {
                throw Error("wat ?")
            }
            let position = current[0];
            let path = current[1];
            if (this.model.model[position.x][position.y] == State.END) {
                return [updates, path];
            }

            visited[position.x][position.y] = true;
            updates.push({indices: {x:position.x, y:position.y}, state:State.VISITED_CELL});
            this.getCandidates(position.x, position.y, this.model.model, visited)
                .filter((value) => {
                    return queue.findIndex((item)=> item[0].x === value.x && item[0].y === value.y) === -1;
                })
                .forEach((candidate) => {
                    let newPath = path.concat([candidate]);
                    queue.push([candidate, newPath]);
                });
        }
        return [[], []]
    }

}