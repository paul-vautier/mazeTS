import { State } from "../../model/cell-state.js";
import { RealTimeGenerator } from "./real-time-generator.js";
/**
 * A generator that can find candidates to generate a maze for a 2D grid with cell-thick walls (as opposed to infinitely thin walls)
 * Thus, potential cells are cells which indices match the condition x, y in 2k + 1, with k in [0, (size-1) / 2]
 * This forces the maze to have an odd amount of cells
 *
 * o => Potential cells
 * x => Walls (that can be carved)
 * X => Walls that will never be carved
 * # # # # # # # #
 * # o x o x o x #
 * # x X x X x x #
 * # o x o x o x #
 * # x X x X x x #
 * # o x o x o x #
 * # # # # # # # #
 */
export class StrictBlockwiseGenerator extends RealTimeGenerator {
    constructor(size) {
        super();
        this.size = size;
    }
    getCandidates(x, y, state, visited) {
        let offsets = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
        ];
        return offsets.filter(offset => {
            return x + 2 * offset.x > 0 &&
                x + 2 * offset.x < state.length - 1 &&
                y + 2 * offset.y > 0 &&
                y + 2 * offset.y < state.length - 1 &&
                !visited[x + 2 * offset.x][y + 2 * offset.y] &&
                state[x + 2 * offset.x][y + 2 * offset.y] == State.WALL;
        });
    }
}
