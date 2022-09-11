import { StateUpdate } from "../../generators/algorithms/state-update.js";
import { ClearedMazeGenerator } from "../../generators/batch/cleared-maze-generator.js";
import { State } from "../../model/cell-state.js";
import { Indices } from "../../model/indices.js";
import { get2dArray, PriorityQueue } from "../../util.js";
import { MazeSolver } from "../maze-solver.js";

// FIXME : Acts as a BFS if begin.x >= end.x 
export class AstarSolver extends MazeSolver {
    doSolve(x: number, y: number): [StateUpdate[], Indices[]] {
        new ClearedMazeGenerator().create(this.model.model.length, this.model);
        let updates : StateUpdate[] = []
        let paths : Indices[][][] = get2dArray(this.model.model.length, []);
        let queue = new PriorityQueue<Indices>((a, b)=> {
            let heurA = this.getHeuristic(a, this.model.end!, paths)
            let heurB = this.getHeuristic(b, this.model.end!, paths)

            if (heurA == heurB) {
                return Math.abs(a.x - this.model.end!.x) + Math.abs(a.y - this.model.end!.y) < Math.abs(b.x - this.model.end!.x) + Math.abs(b.y - this.model.end!.y) 
            }

            return heurA < heurB; 
        });
        let indice : Indices;
        let begin : Indices = {x:x, y:y};
        queue.insert(begin);
        paths[x][y] = [begin];
        let visited = get2dArray(this.model.model.length, false);
        while(!queue.isEmpty()) {
            indice = queue.shift();
            if (visited[indice.x][indice.y]) {
                continue;
            }
            visited[indice.x][indice.y] = true;
            updates.push({indices: indice, state: State.VISITED_CELL});

            if (this.model.model[indice.x][indice.y] == State.END) {
                return [updates, paths[indice.x][indice.y]];
            }
            this.getCandidates(indice.x, indice.y, this.model.model, visited).forEach((candidate) => {
                if (paths[candidate.x][candidate.y].length == 0 || paths[candidate.x][candidate.y].length > paths[indice.x][indice.y].length + 1) {
                    paths[candidate.x][candidate.y] = paths[indice.x][indice.y].concat(candidate);
                }
                queue.insert(candidate);
            });
            
        }
        return [[], []]
    }

    private getHeuristic(path: Indices, end: Indices, paths: Indices[][][]) {
        return paths[path.x][path.y].length + Math.abs(path.x - end.x) + Math.abs(path.y - end.y)
    }
 }