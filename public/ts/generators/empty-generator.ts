import { State } from "../cell-state.js";
import { MazeGenerator } from "./maze-generator.js";


export class EmptyGenerator implements MazeGenerator {
    create(size : number): State[][] {
        let grid : State[][];
        grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = []
            for (let j = 0; j < size; j++) {
                grid[i].push(State.UNVISITED_CELL);
            }
        }
        return grid;
    }

}