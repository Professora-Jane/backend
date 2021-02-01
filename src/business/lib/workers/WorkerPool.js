const ConflictException = require("../httpExceptions/ConflictException");
const BaseWorkerService = require("./abstracts/BaseWorkerService");
const DefaultStrategy = require("./abstracts/DefaultStrategy");

class WorkerPool {
    constructor() {
        /**
         * @type { Object.<string, DefaultStrategy> }
         */
        this.strategies = {}
    }

    /**
     * 
     * @param { DefaultStrategy } strategyHandler - Handler da estratégia
     * @param { string } strategyName - Nome da estratégia que será adicionada
     * @param { object } strategyConfig - Objeto de configuração da estratégia
     */
    addStrategy(strategyHandler, strategyName, strategyConfig) {
        if (this.strategies[strategyName])
            throw new ConflictException("Estratégia já adicionada")
        
        this.strategies[strategyName] = new strategyHandler()
        this.strategies[strategyName].configStrategy(strategyConfig)
        
        return this;
    }

    /**
     * 
     * @param { BaseWorkerService } worker 
     * @param { object } opts 
     * @param { string } opts.strategyName - Nome da estratégia que o worker irá utilizar
     * @param { number } opts.workerType - Tipo de worker que será usado. Recomenda-se utilizar o objecto exportado 'workerTypes'
     */
    addWorker(worker, { strategyName, workerType }) {
        if (!this.strategies[strategyName])
            throw new ConflictException("Estratégia inválida")

        this.strategies[strategyName].addWorker(worker, { workerType })

        return this;
    }

    /**
     * @param { string } type - Tipo de mensagem a ser publicada. Atualmente suporta "PubSub"
     * @param { string } topic - Tópico ao qual a mensagem será publicada
     * @param { object } content - conteúdo da mensagem a ser enviado
     */
    publish(type, topic, content) {
        Object.keys(this.strategies).map(key => {
            this.strategies[key][`publish${type}`] && this.strategies[key][`publish${type}`](topic, content)
        })
    }

}

const instance = new WorkerPool();

module.exports = {
    workerPoolInstance: (() => instance)(),
    workerTypes: {
        "pubsub": 0,
        "queueWorker": 1
    }

}