import { State } from '../model/cell-state.js';
export class MazeSolver {
    constructor(model) {
        this.model = model;
    }
    solve(x, y) {
        if (!this.model.end || !this.model.begin) {
            throw Error("A solver requires a beginning and an end to be set");
        }
        let [updates, indices] = this.doSolve(x, y);
        updates.forEach(update => this.model.updateModel(update.indices.x, update.indices.y, update.state));
        indices.forEach(indice => this.model.updateModel(indice.x, indice.y, State.PATH));
    }
    getCandidates(x, y, state, visited) {
        let offsets = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
        ];
        return offsets.filter(offset => {
            return x + offset.x > 0 &&
                x + offset.x < state.length - 1 &&
                y + offset.y > 0 &&
                y + offset.y < state.length - 1 &&
                !visited[x + offset.x][y + offset.y] &&
                state[x + offset.x][y + offset.y] != State.WALL;
        }).map((offset) => {
            return { x: offset.x + x, y: offset.y + y };
        });
    }
}
