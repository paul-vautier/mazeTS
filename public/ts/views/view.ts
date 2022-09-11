import { State } from "../model/cell-state.js";
import { Model } from "../model/model.js";
import { ModelListener } from "../model/model-listener.js";

export abstract class EventPollingView implements ModelListener {
    mazeParent : HTMLElement;
    
    eventsMap: Map<string, (x : number, y : number)=>void>
    eventPoll: {type: string, callback :()=>void}[]
    interval: number | undefined;
    
    speed = 4;
    cellUpdateCount = 10;
    constructor(model : Model) {
        let mazeParent = document.getElementById("maze");
        if (!mazeParent) {
            throw Error("Couldn't find the #maze element");
        }
        let rateElement = document.getElementById("refreshRate")
        if (rateElement instanceof HTMLInputElement) {
            rateElement.value = (1000 / this.speed).toString()
        }
        
        let countElement = document.getElementById("refreshCount")
        if (countElement instanceof HTMLInputElement) {
            countElement.value = this.cellUpdateCount.toString()
        }
        
        this.eventsMap = new Map();
        this.eventPoll = []

        this.pollEvents()

        this.mazeParent = mazeParent;
        model.addListener(this);
    }
    
    changeRefreshRate(speed: number) {
        clearInterval(this.interval);
        this.speed = speed;
        this.pollEvents();
    }

    changeRefreshCount(count: number) {
        clearInterval(this.interval);
        this.cellUpdateCount = count;
        this.pollEvents();
    }

    pollEvents() {
        let elt;
        let continueLoop;

        this.interval = setInterval(() => {
            continueLoop = true;
            for(let i = 0; continueLoop && i <  this.cellUpdateCount && (elt = this.eventPoll.shift()) != null; i++) {
                elt.callback();
                if ("reset" === elt.type) {
                    continueLoop = this.modelResetPolling(this.interval!)
                }
            }
        }, this.speed);
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