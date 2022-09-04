import { State } from "./cell-state.js";
import { MazeGenerator } from "../generators/algorithms/maze-generator.js";
import { ModelListener } from "./model-listener.js";
import { Indices } from "./indices.js";

export class Model {
    model: State[][];
    begin?: Indices;
    end?: Indices;
    listeners : ModelListener[];

    constructor() {
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
        if (this.model[x][y] == State.END || this.model[x][y] == State.BEGIN) {
            return;
        } 
        this.model[x][y] = state;
        if (state == State.END) {
            if (this.end) {
                let end = this.end;
                this.listeners.forEach(listener=>listener.onUpdate(end.x, end.y, State.UNVISITED_CELL))    
            }
            this.end = {x: x, y: y};
        }
        if (state == State.BEGIN) {
            if (this.begin) {
                let begin = this.begin
                this.listeners.forEach(listener=>listener.onUpdate(begin.x, begin.y, State.UNVISITED_CELL))
            }
            this.begin= {x: x, y: y};
        }
        this.listeners.forEach(listener=>listener.onUpdate(x, y, state))
    }

    addListener(listener: ModelListener) {
        this.listeners.push(listener);
    }
}