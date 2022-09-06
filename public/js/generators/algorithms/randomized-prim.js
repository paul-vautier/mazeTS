import { WallGenerator } from "../batch/wall-generator.js";
import { StrictBlockwiseGenerator } from "./strict-blockwise-generator.js";
export class RandomizedPrim extends StrictBlockwiseGenerator {
    create(size, model) {
        const grid = new WallGenerator().create(size);
        const visited = new Array(size).fill(false)
            .map(() => new Array(size).fill(false));
        model.regenerate(grid);
    }
    carve() {
    }
}
