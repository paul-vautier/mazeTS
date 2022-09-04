import { State } from "../model/cell-state.js";
import {MazeSolver} from "./maze-solver.js"

export class RandomSolver extends MazeSolver {
    solve(): {x:number, y:number}[] {
        return []
    }

}