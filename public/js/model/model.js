import { State } from "./cell-state.js";
export class Model {
    constructor() {
        this.model = [];
        this.listeners = [];
    }
    regenerate(state) {
        this.model = state;
        this.listeners.forEach(listener => listener.onReset(structuredClone(this.model)));
    }
    updateModel(x, y, state) {
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
                this.model[end.x][end.y] = State.UNVISITED_CELL;
                this.listeners.forEach(listener => listener.onUpdate(end.x, end.y, State.UNVISITED_CELL));
            }
            this.end = { x: x, y: y };
        }
        if (state == State.BEGIN) {
            if (this.begin) {
                let begin = this.begin;
                this.model[begin.x][begin.y] = State.UNVISITED_CELL;
                this.listeners.forEach(listener => listener.onUpdate(begin.x, begin.y, State.UNVISITED_CELL));
            }
            this.begin = { x: x, y: y };
        }
        this.listeners.forEach(listener => listener.onUpdate(x, y, state));
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
}
