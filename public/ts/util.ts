export function getRandomInt(min : number, max : number) : number{
    return min + Math.floor(Math.random() * (max-min));
}

export  function get2dArray<T>(size: number, value: T) : T[][]{
    return new Array(size).fill(structuredClone(value))
        .map(() =>
            new Array(size).fill(structuredClone(value))
        );
}

export class PriorityQueue<T> {
    private array: T[] = []
    private comparator: (toInsert: T, toCompare: T) => boolean;

    constructor(comparator : (toInsert: T, toCompare: T) => boolean) {
        this.comparator = comparator;
    }

    insert(item: T) : void {
        this.array.push(item);
    }

    peek(): T {
        let index = this.getFirstIndex();
        if (index == -1) {
            throw new Error("Empty queue");
        }
        return this.array[index];
    }
    shift(): T {

        let index = this.getFirstIndex();
        if (index == -1) {
            throw new Error("Empty queue");
        }
        return this.array.splice(index, 1)[0];
    }
    size(): number {
        return this.array.length;
    }

    isEmpty(): boolean {
        return this.array.length == 0;
    }

    private getFirstIndex() : number {
        if (this.array.length == 0) {
            return -1;
        }
        if (this.array.length == 1) {
            return 0;
        }
        let index = 1;
        let chosen = 0;
        while(this.array.length > index) {
            if (!this.comparator(this.array[chosen], this.array[index])) {
                chosen = index;
            }
            index++
        };
        return chosen;
    }

}