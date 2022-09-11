import { State } from "../model/cell-state.js";
import { Model } from "../model/model.js";
import { ModelListener } from "../model/model-listener.js";

const speed = 4;
const cellUpdateCount = 10;
export abstract class EventPollingView implements ModelListener {
    mazeParent : HTMLElement;
    
    eventsMap: Map<string, (x : number, y : number)=>void>
    eventPoll: {type: string, callback :()=>void}[]

    constructor(model : Model) {
        let mazeParent = document.getElementById("maze");
        if (!mazeParent) {
            throw Error("Couldn't find the #maze element");
        }

        
        this.eventsMap = new Map();
        this.eventPoll = []

        this.pollEvents()

        this.mazeParent = mazeParent;
        model.addListener(this);
    }

    
    pollEvents() {
        let elt;
        let continueLoop;

        let interval = setInterval(() => {
            continueLoop = true;
            for(let i = 0; continueLoop && i <  cellUpdateCount && (elt = this.eventPoll.shift()) != null; i++) {
                elt.callback();
                if ("reset" === elt.type) {
                    continueLoop = this.modelResetPolling(interval)
                }
            }
        }, speed);
    }

    modelResetPolling(interval : number) : boolean{
        return true;
    }

    onReset(model: State[][]): void {
        this.eventPoll = []
        this.eventPoll.push({
            type:"reset",
            callback: () => {
                this.doOnReset(model)
            }
        })
    }

    onUpdate(x: number, y: number, state: State): void {
        this.eventPoll.push({
            type:"update",
            callback: () => {
                this.doOnUpdate(x, y, state);
            }
        });
    }

    abstract doOnReset(model: State[][]): void;    

    abstract doOnUpdate(x: number, y: number, state: State): void;

    abstract addEventListenerToEachCell(event : string, callback : (x : number, y : number)=>void) : void;

    destroy() : void{
        this.mazeParent.innerHTML = '';
    }
}