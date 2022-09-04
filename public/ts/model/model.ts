import { State } from "./cell-state.js";
import { MazeGenerator } from "../generators/algorithms/maze-generator.js";
import { ModelListener } from "./model-listener.js";

export class Model {
    model: State[][];
    generator: MazeGenerator;
    listeners : ModelListener[];

    constructor(generator: MazeGenerator) {
        this.generator = generator;
        this.model = []
        this.listeners = []
    }

    regenerate(state: State[][]) {
        this.model = state
        this.listeners.forEach(listener=>listener.onReset(structuredClone(this.model)))
    }

    updateModel(x: number, y: number, state: State) {
        if (!this.model) {
            return;
        }
        this.model[x][y] = state
        this.listeners.forEach(listener=>listener.onUpdate(x, y, state))
    }

    addListener(listener: ModelListener) {
        this.listeners.push(listener);
    }
}