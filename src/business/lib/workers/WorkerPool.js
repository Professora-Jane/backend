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
     * Método responsável por adicionar uma estratégia . As estratégias devem, necessariamente, 
     * herdar da classe Default Strategy. 
     * 
     * O método espera o handler da estratégia (somente referência, não uma classe instanciada),
     * o nome da estratégia e um objeto de configurações que será passado diretamente à strategy.
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
     * Método responsável por adicionar um worker. O worker não é adicionado diretamente ao workerPool, e sim 
     * à estratégia selecionada. Logo, é de suma importância que a estratégia seja sempre adicionada ANTES do 
     * worker, e nunca depois. 
     * 
     * O Worker deve, necessariamente, herdar da classe BaseWorkerService.
     * @param { BaseWorkerService } worker 
     * @param { object } opts 
     * @param { string | Array<string> } opts.strategyName - Nome da estratégia que o worker irá utilizar
     * @param { workerTypes  } opts.workerType - Tipo de worker que será usado. Recomenda-se utilizar o objecto exportado 'workerTypes'
     */
    addWorker(worker, { strategyName, workerType }) {

        if (Array.isArray(strategyName)) {
            strategyName.map(strategy => {
                if (!this.strategies[strategy])
                    throw new ConflictException("Estratégia inválida")

                this.strategies[strategy].addWorker(worker, { workerType })
            })
        }
        else {
            if (!this.strategies[strategyName])
                throw new ConflictException("Estratégia inválida")

            this.strategies[strategyName].addWorker(worker, { workerType })
        }

        return this;
    }

    /**
     * Método responsável por iniciar os workers de cada estratégia.
     */
    async init() {
        Object.keys(this.strategies).forEach(async strategy => {
            await this.strategies[strategy].configureWorkers()
        })
    }

    /**
     * @param { object } opts 
     * @param { string } opts.strategy - Estratégia pelo qual o envio será realizado
     * @param { string } opts.type - Tipo de mensagem a ser publicada. Atualmente suporta "PubSub"
     * @param { string } opts.topic - Tópico ao qual a mensagem será publicada
     * @param { object } opts.content - conteúdo da mensagem a ser enviado
     */
    async publish({ strategy, type, topic, content }) {
        this.strategies[strategy][`publish${type}`] && await this.strategies[strategy][`publish${type}`](topic, content)
    }

}

const instance = new WorkerPool();
const workerTypes = Object.freeze({
    pubsub: "pubsub",
    queueWorker: "queueWorker"
})

const publishTypes = Object.freeze({
    PubSub: "PubSub",
})

module.exports = {
    workerPoolInstance: (() => instance)(),
    workerTypes,
    publishTypes
}