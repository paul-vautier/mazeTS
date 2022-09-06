/**
 * Generator that will quickly regenerate the model with little animation
 * Enforces the use of regenerates by only exposing
 */
export class RealTimeGenerator {
    constructor() {
        this.create = (size, model) => {
            let grid = this.doCreate(size, model);
            model.regenerate(grid);
        };
    }
}
