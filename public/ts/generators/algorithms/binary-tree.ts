import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";
import { ClearedMazeGenerator } from "../batch/cleared-maze-generator.js";
import { WallGenerator } from "../batch/wall-generator.js";
import { StateUpdate } from "./state-update.js";
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";

export class BinaryTreeGenerator extends StrictBlockwiseGenerator {

    protected doCreate(size: number, model: Model): StateUpdate[] {
        new WallGenerator().create(size, model);
        let updates : StateUpdate[] = [];
        for (let i = 1; i < size -1; i+=2) {
            for (let j = 1; j < size -1; j+=2) {
                updates.push({indices: {x: i, y: j}, state: State.UNVISITED_CELL});
                if (i == 1 && j == 1) {
                    continue;
                }
                if (j == 1) {
                    updates.push(this.carveWest(i, j));
                } else if (i == 1) {
                    updates.push(this.carveUp(i, j));
                } else if (Math.random() > 0.5) {
                    updates.push(this.carveUp(i, j));
                } else {
                    updates.push(this.carveWest(i, j));
                }
            }
        }
        
        updates.push({indices :{x:1, y:1}, state:State.BEGIN});
        updates.push({indices :{x: size-2, y: size-2}, state:State.END});
        return updates;
    }

    private carveUp(x : number, y : number) : StateUpdate{
        return {indices: {x, y: y-1}, state: State.UNVISITED_CELL};
    }

    private carveWest(x : number, y : number) : StateUpdate{
        return {indices: {x: x-1,y}, state: State.UNVISITED_CELL};
    }
}