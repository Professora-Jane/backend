

class BaseRepository {
    constructor(schema) {
        this.model = schema
    }

    async $getById(id) {
        return await this.model.findOnde({ _id: id })
    }

    async $save(dataModel) {
        const createdItem = await this.model(dataModel).save();

        return createdItem;
    }
}

module.exports = BaseRepository