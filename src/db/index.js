const mongoose = require('mongoose');

class Db {
    constructor() {
        this._mongoose = undefined
    }

    async connect({ connectionString, options }) {
        if (this._mongoose == undefined)
            this._mongoose = await mongoose.connect(connectionString, options);
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