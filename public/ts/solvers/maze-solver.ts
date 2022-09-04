import {State} from '../model/cell-state.js'
import { Indices } from '../model/indices.js';
import { Model } from '../model/model.js';
export abstract class MazeSolver {
    model: Model;
    constructor(model: Model) {
        this.model = model;
    }

    abstract solve(x: number, y: number) : Indices[];

    getCandidates(x: number, y: number, state: State[][], visited: boolean[][]) : Indices[] {
        let offsets = [
            {x:-1, y: 0},
            {x: 1, y: 0},
            {x:0, y: -1},
            {x:0, y: 1},
        ]
        return offsets.filter(offset=> {
            return x + offset.x > 0 && 
                x + offset.x < state.length -1 &&
                y + offset.y > 0 &&
                y + offset.y < state.length -1 &&
                !visited[x + offset.x][y + offset.y] &&
                state[x + offset.x][y + offset.y] != State.WALL;
        }).map((offset)=> {
            return {x: offset.x + x, y: offset.y + y};
        });
    }
}