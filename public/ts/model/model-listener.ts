import { State } from "./cell-state.js";
import { Model } from "./model.js";

export interface ModelListener {
    onReset(model: State[][]) : void
    onUpdate(x: number, y: number, state: State) : void
}