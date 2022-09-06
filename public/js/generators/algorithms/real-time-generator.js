/**
 * Generator that will quickly regenerate the model with little animation
 * Enforces the use of regenerates by only exposing
 */
export class RealTimeGenerator {
    constructor() {
        this.create = (size, model) => {
            this.doCreate(size, model).forEach(update => {
                model.updateModel(update.indices.x, update.indices.y, update.state);
            });
        };
    }
}
