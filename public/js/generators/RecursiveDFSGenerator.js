import { getRandomInt } from '../util.js';
class RecursiveDFSGenerator {
    constructor(baseGenerator) {
        this.baseGenerator = baseGenerator;
    }
    create(size) {
        let grid = this.baseGenerator.create(size);
        let x = getRandomInt(1, size);
        let y = getRandomInt(1, size);
        return grid;
    }
    carve(x, y) {
    }
}
