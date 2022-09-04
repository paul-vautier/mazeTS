import { State } from "../model/cell-state.js";
import { Indices } from "../model/indices.js";
import { Model } from "../model/model.js";
import { get2dArray } from "../util.js";
import { MazeSolver } from "./maze-solver.js";

export class BFSSolver extends MazeSolver {
    constructor(model: Model) {
        super(model)
    }

    solve(x: number, y:number): Indices[] {
        let queue : [Indices, Indices[]][]
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
                return path;
            }

            visited[position.x][position.y] = true;
            this.model.updateModel(position.x, position.y, State.VISITED_CELL);
            this.getCandidates(position.x, position.y, this.model.model, visited).forEach((candidate) => {
                let newPath = structuredClone(path).concat([candidate]);
                queue.push([candidate, newPath]);
            });
        }
        return []
    }

}