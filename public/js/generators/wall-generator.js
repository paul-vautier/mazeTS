import { State } from "../model/cell-state.js";
export class WallGenerator {
    create(size, model) {
        let grid;
        grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = [];
            for (let j = 0; j < size; j++) {
                grid[i].push(State.WALL);
            }
        }
    }
}
