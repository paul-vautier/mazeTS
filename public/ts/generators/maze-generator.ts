import { State } from "../model/cell-state.js";
import { Model } from "../model/model.js";

/**
 * Maze generation interface
 * Mutates the model
 */
export interface MazeGenerator {
    create: (size: number, model: Model) => void;
}