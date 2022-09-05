import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";
import { BatchGenerator } from "../batch-generator.js";


export class WallGenerator extends BatchGenerator {
    
    doCreate(size: number, model: Model): [boolean, State[][]] {
        let grid : State[][];
        grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = []
            for (let j = 0; j < size; j++) {
                grid[i].push(State.WALL);
            }
        }
        return [true, grid];
    }

}