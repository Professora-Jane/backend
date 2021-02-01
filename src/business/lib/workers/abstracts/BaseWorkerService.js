const InvalidParamsException = require("../../httpExceptions/InvalidParamsException");

class BaseWorkerService {
    constructor({ topic }) {
        if (this.constructor == BaseWorkerService) {
            throw new Error("Não é possível instanciar uma classe abstrata");
        }
      
        if (!topic)
            throw new InvalidParamsException("Tópico não informado")

        this.topic = topic
    }

    /**
     * @abstract
     * @param { object } msg 
     */
    execute() {
        throw new Error("Not implemented")
    }

    /**
     * @abstract
     * @param { Error } err
     * @param { object } originalMsg
     */
    doOnError() {
        throw new Error("Not implemented")
    }
}

module.exports = BaseWorkerService