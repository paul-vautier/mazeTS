import { State } from "../../model/cell-state";
import { Indices } from "../../model/indices";

export interface StateUpdate {
    indices : Indices,
    state : State
}