import { State } from "../cell-state.js";
import {MazeSolver} from "./maze-solver.js"

export class RandomSolver extends MazeSolver {
    solve(): [number, number][] {
        return []
    }

}