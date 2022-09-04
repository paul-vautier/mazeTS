import { State } from "../../model/cell-state.js";
import { Model } from "../../model/model.js";
import { MazeGenerator } from "./maze-generator.js";

export abstract class StrictBlockwiseGenerator implements MazeGenerator {
    size: number
    constructor(size: number) {
        this.size = size;
    }

    abstract create(size : number, model: Model) : void;

    getCandidates(x: number, y: number, state: State[][], visited: boolean[][]) : {x: number, y:number}[] {
        let offsets = [
            {x:-1, y: 0},
            {x: 1, y: 0},
            {x:0, y: -1},
            {x:0, y: 1},
        ]
        return offsets.filter(offset=> {
            return x + 2 * offset.x > 0 && 
                x + 2 * offset.x < state.length -1 &&
                y + 2 * offset.y > 0 &&
                y + 2 * offset.y < state.length -1 &&
                !visited[x+2*offset.x][y + 2*offset.y] &&
                state[x + 2*offset.x][y + 2*offset.y] == State.WALL;
        });
    }
}
