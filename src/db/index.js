const mongoose = require('mongoose');

class Db {
    constructor() {
        this._mongoose = undefined
    }

    async connect({ connectionString, options, retryAttempts = 0, retryTimeout }) {
        if (this._mongoose == undefined)
        try {
            this._mongoose = await mongoose.connect(connectionString, options);
        }
        catch(error) {
            console.error(error)
            if (retryAttempts) {
                setTimeout(() => this.connect({connectionString, options, retryAttempts: --retryAttempts, retryTimeout }), retryTimeout)
            }
        }
    }

    getCollection(modelName, schema) {
        if (this._mongoose == undefined)
            throw new Error("Conexão com o banco não realizada!!")

        return this._mongoose.model(modelName, schema);
    }
}


const instance = new Db();

module.exports = {
    dbInstance: (() => instance)()
}