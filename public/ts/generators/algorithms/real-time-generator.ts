import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";
import { MazeGenerator } from "../maze-generator.js";
import { StateUpdate } from "./state-update.js";

/**
 * Generator that will quickly regenerate the model with little animation
 * Enforces the use of regenerates by only exposing 
 */
export abstract class RealTimeGenerator implements MazeGenerator {
    readonly create = (size: number, model: Model): void => {
        this.doCreate(size, model).forEach(update=> {
            model.updateModel(update.indices.x, update.indices.y, update.state)
        });
    }

    protected abstract doCreate(size: number, model: Model) : StateUpdate[];
}