import {State} from '../model/cell-state.js'
export abstract class MazeSolver {
    onCellUpdate : ((x : number, y : number, state : State) => void) | undefined;
    abstract solve() : {x:number, y:number}[];

    setOnCellUpdate(callback : (x : number, y : number, state : State) => void) : void {
        this.onCellUpdate = callback
    }
}