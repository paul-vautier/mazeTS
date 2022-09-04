import { State } from "../model/cell-state.js";
import { Indices } from "../model/indices.js";
import {MazeSolver} from "./maze-solver.js"

export class RandomSolver extends MazeSolver {
    solve(): Indices[] {
        return []
    }

}