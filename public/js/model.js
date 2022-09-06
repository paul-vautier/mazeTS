import { State } from "./cell-state";
export class Model {
    constructor(generator) {
        this.generator = generator;
        this.model = [];
    }
    regenerate(size) {
        this.model = new Array(size).fill(State.UNVISITED_CELL)
            .map(() => new Array(size).fill(State.UNVISITED_CELL));
        this.generator.create(size, this);
    }
    updateModel(x, y, state) {
        if (!this.model) {
            return;
        }
        this.model[x][y] = state;
        if (this.onUpdateModel) {
            this.onUpdateModel(x, y, state);
        }
    }
    setOnUpdateModel(callback) {
        this.onUpdateModel = callback;
    }
}
