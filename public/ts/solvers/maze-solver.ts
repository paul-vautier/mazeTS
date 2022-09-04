import {State} from '../model/cell-state.js'
export abstract class MazeSolver {
    onCellUpdate : ((x : number, y : number, state : State) => void) | undefined;
    abstract solve() : Indices[];

    setOnCellUpdate(callback : (x : number, y : number, state : State) => void) : void {
        this.onCellUpdate = callback
    }
}