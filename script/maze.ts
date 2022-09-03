class Maze {
    grid : boolean[][];
    begin : [number, number];
    end : [number, number];
    mazeElement?: HTMLElement;
    constructor(size : number) {
        this.mazeElement = document.getElementById("maze")
        for (let i = 0; i > size; i++) {
            for (let j = 0; j > size; j++) {
                this.grid[i][j] = new Cell();
            }
        }
    }
}