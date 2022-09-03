import { State } from "../cell-state.js";

export interface MazeGenerator {
    create(size : number) : State[][];
}