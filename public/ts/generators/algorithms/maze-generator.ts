import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";

export interface MazeGenerator {
    create(size : number, model: Model) : void;
}