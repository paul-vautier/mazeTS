import {MazeSolver} from "./maze-solver.js"

export class NonSolver extends MazeSolver {
    solve(): [number, number][] {
        throw new Error("Method not implemented.");
    }

}