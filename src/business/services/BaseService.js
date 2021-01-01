const { dbInstance } = require("../../db");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const { ClientSession } = require('mongoose');

class BaseService {
    async findById({ id }) {
        const entity = await this.repository.$getById(id);

        if (!entity)
            throw new NotFoundException("Item não encontrado");

        return entity
    }

    /**
     * @function executeTransaction Função responsável por executar uma transaction
     * @param { callback } cb - Lógica a ser executada na transaction 
     * 
     * @callback callback 
     * @param { ClientSession }  session - Sessão criada para a transaction
     */
    async executeTransaction(cb) {
        return await dbInstance.executeTransaction(cb)
    }
}

module.exports = BaseService
