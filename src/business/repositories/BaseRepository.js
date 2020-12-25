const DateUtil = require("../lib/DateUtil")

class BaseRepository {
    constructor(schema) {
        this.model = schema
    }

    async $getById(id) {
        return await this.model.findOne({ _id: id })
    }

    async $save(dataModel) {
        const createdItem = await this.model(dataModel).save();

        return createdItem;
    }

    async $update(dataModel) {
        dataModel.lastUpdateDate = DateUtil.getDateWithTz();

        const updatedItem = await this.$save(dataModel);

        return updatedItem;
    }

    async $listAggregate(aggregationPipeline) {
        const aggregatedPipeline = await this.model.aggregate(aggregationPipeline).exec();
        
        return aggregatedPipeline;
    }
}

module.exports = BaseRepository