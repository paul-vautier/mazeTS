import { State } from "../model/cell-state.js";
export class EmptyGenerator {
    create(size) {
        let grid;
        grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = [];
            for (let j = 0; j < size; j++) {
                grid[i].push(State.UNVISITED_CELL);
            }
        }
        return grid;
    }
}
