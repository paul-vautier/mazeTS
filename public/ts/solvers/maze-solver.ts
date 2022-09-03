import {State} from '../cell-state.js'
export abstract class MazeSolver {
    onCellUpdate : ((x : number, y : number, state : State) => void) | undefined;
    abstract solve() : [number, number][];

    setOnCellUpdate(callback : (x : number, y : number, state : State) => void) : void {
        this.onCellUpdate = callback
    }
}