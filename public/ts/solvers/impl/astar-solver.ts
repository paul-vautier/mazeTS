import { StateUpdate } from "../../generators/algorithms/state-update.js";
import { ClearedMazeGenerator } from "../../generators/batch/cleared-maze-generator.js";
import { State } from "../../model/cell-state.js";
import { Indices } from "../../model/indices.js";
import { Model } from "../../model/model.js";
import { get2dArray } from "../../util.js";
import { MazeSolver } from "../maze-solver.js";

export class AstarSolver extends MazeSolver {
    doSolve(x: number, y: number): [StateUpdate[], Indices[]] {
        throw new Error("Method not implemented.");
    }
}