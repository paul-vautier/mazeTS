import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";
import { MazeGenerator } from "../algorithms/maze-generator.js";

export interface BatchGenerator {
    create(size: number): State[][];
}