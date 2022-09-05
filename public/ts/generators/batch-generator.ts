import { State } from "../model/cell-state.js";
import { Model } from "../model/model.js";
import { MazeGenerator } from "./maze-generator.js";

/**
 * Generator that will quickly regenerate the model with little animation
 * Enforces the use of regenerates by only exposing 
 */
export abstract class BatchGenerator implements MazeGenerator {
    readonly create = (size: number, model: Model): void => {
        let [ok, grid]  = this.doCreate(size, model);
        if (ok) {
            model.regenerate(grid);
        }
    }

    protected abstract doCreate(size: number, model: Model) : [boolean, State[][]];
}