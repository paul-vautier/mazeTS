/**
 * Generator that will quickly regenerate the model with little animation
 * Enforces the use of regenerates by only exposing
 */
export class BatchGenerator {
    constructor() {
        this.create = (size, model) => {
            let [ok, grid] = this.doCreate(size, model);
            if (ok) {
                model.regenerate(grid);
            }
        };
    }
}
