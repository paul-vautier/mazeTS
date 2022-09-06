export function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
}
export function get2dArray(size, value) {
    return new Array(size).fill(structuredClone(value))
        .map(() => new Array(size).fill(structuredClone(value)));
}
export class PriorityQueue {
    constructor(comparator) {
        this.array = [];
        this.comparator = comparator;
    }
    insert(item) {
        this.array.push(item);
    }
    peek() {
        let index = this.getFirstIndex();
        if (index == -1) {
            throw new Error("Empty queue");
        }
        return this.array[index];
    }
    shift() {
        let index = this.getFirstIndex();
        if (index == -1) {
            throw new Error("Empty queue");
        }
        return this.array.splice(index, 1)[0];
    }
    size() {
        return this.array.length;
    }
    isEmpty() {
        return this.array.length == 0;
    }
    getFirstIndex() {
        if (this.array.length == 0) {
            return -1;
        }
        if (this.array.length == 1) {
            return 0;
        }
        let index = 1;
        let chosen = 0;
        while (this.array.length > index) {
            if (!this.comparator(this.array[chosen], this.array[index])) {
                chosen = index;
            }
            index++;
        }
        ;
        return chosen;
    }
}
