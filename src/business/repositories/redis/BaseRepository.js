const NohmModel = require('nohm').NohmModel;
const { Types } = require("mongoose");


class BaseRepository {
    constructor(dataModel) {
        /**
         * @type { NohmModel }
         */
        this.model = new dataModel()
    }

    async $save(modelData) {
        this.model.property(modelData)

        return await this.model.save()
    }

    /**
     * @param { object } modelData 
     */
    async $update(modelData) {
        const id = modelData.id

        delete modelData.id

        this.model.property(modelData)
        this.model.id = id

        return await this.model.save()
    }

    /**
     * 
     * @param { object } query
     */
    async $findOne(query) {
        const result = await this.model.find(query)

        if (result.length !== 1)
            return false

        return await this.model.load(result[0])
    }

    /**
     * @param { NohmModel } instance 
     */
    async $deleteOne(modelData) {
        const id = modelData.id

        delete modelData.id

        this.model.property(modelData)
        this.model.id = id

        await this.model.remove()
    }
}

module.exports = BaseRepository