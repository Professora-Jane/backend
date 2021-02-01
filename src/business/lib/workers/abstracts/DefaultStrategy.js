const BaseWorkerService = require("./BaseWorkerService")

class DefaultStrategy {
    constructor() {
        if (this.constructor == DefaultStrategy) {
            throw new Error("Não é possível instanciar uma classe abstrata");
        }
    }

    /**
     * @abstract
     */
    configStrategy() {
        throw new Error("Not implemented")
    }

    /**
     * @abstract
     * @param { BaseWorkerService } worker - Instância da classe do worker 
     * @param { object } opts - Objeto de configurações 
     * @param { string } opts.workerType - Tipo de worker
     */
    addWorker() {
        throw new Error("Not implemented")
    }

    /**
     * @abstract
     */
    publishPubSub() {
        throw new Error("Not implemented")
    }
}

module.exports = DefaultStrategy