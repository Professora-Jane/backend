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

        const updatedItem = await dataModel.save();

        return updatedItem;
    }

    async $listAggregate(aggregationPipeline) {
        const aggregatedPipeline = await this.model.aggregate(aggregationPipeline).exec();
        
        return aggregatedPipeline;
    }

    /**
     * @description Função genérica responsável por paginar uma model de acordo com uma query e busca.
     * @param { object } params 
     * @param { string | Number } params.page - Número da página atual
     * @param { string | Number } params.limit - Limite de itens por página
     * @param { Array<string> } [params.searchFields = []] - Array com as chaves (atributos) que serão considerados ao se realizar a busca
     * @param { string } [params.search = undefined ] - Termo que será buscado
     * @param { object } [params.itemQuery = {}] - Query de limite dos itens que serão paginados.
     * @returns { boolean | object }
     */
    async $paginate({ page, limit, searchFields = [], search = undefined, itemQuery = {} }) {
        const initialPipeline = [
            {
                '$match': itemQuery
            },
            ...(!!search.length ? [{
				'$match': {
                    '$or': searchFields.map(field => ({ [field]: {'$regex': search, '$options': 'i'} }))
				}
            }] : [])
        ]

        const totalOfItems = await this.$listAggregate([
            ...initialPipeline,
            {
                '$count': 'id'
            }
        ])

        const itemList = await this.$listAggregate([
            ...initialPipeline,
			{
                '$skip': Number(limit) * (Number(page) - 1)
            }, {
                '$limit': Number(limit)
            }
        ])

        let result = false

        if (itemList.length > 0) {
            result = {
                items: itemList,
                numberOfItemsInPage: itemList.length,
                currentPage: +page,
                totalPages: Math.ceil(totalOfItems[0].id / +limit),
                totalItems: totalOfItems[0].id
            }
        }

        return result;
    }
}

module.exports = BaseRepository