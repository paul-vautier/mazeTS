import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";
import { BatchGenerator } from "../batch-generator.js";


export class ClearedMazeGenerator extends BatchGenerator {
    doCreate(size : number, model: Model): [boolean, State[][]] {
        if (size !== model.model.length) {
            throw Error("Invalid arguments : size and model length mismatch");
        }
        let grid = structuredClone(model.model);
        let ok = false;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (grid[i][j] == State.VISITED_CELL || grid[i][j] == State.PATH) {
                        ok =true;
                        grid[i][j] = State.UNVISITED_CELL;
                }
            }
        }
        return [ok, grid];
    }

}