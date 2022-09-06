export class StrictBlockwiseGenerator {
    constructor(size) {
        this.size = size;
    }
    getCandidates(x, y, state, visited) {
        let offsets = [
            { x: -1, y: 0 },
            { x: +1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: -1 },
        ];
        return offsets.filter(offset => {
            return x + 2 * offset.x > 0 &&
                x + 2 * offset.x < state.length - 1 &&
                y + 2 * offset.y > 0 &&
                y + 2 * offset.y < state.length - 1 &&
                !visited[x + 2 * offset.x][y + 2 * offset.y] &&
                state[x + offset.x][y + offset.y];
        }).map(offset => {
            return { x: x + offset.x, y: y + offset.y };
        });
    }
}
