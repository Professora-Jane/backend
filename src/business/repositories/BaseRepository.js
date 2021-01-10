const DateUtil = require("../lib/DateAndTimeUtil");
const LogsModel = require("../models/LogsModel");
const { Types, Mongoose, Model } = require("mongoose");

class BaseRepository {

    /**
     * 
     * @param { Model<T> } schema 
     */
    constructor(schema) {

        /**
         * @type { baseModel<schema> } model
         */
        this.model = schema
        this.logSchema = LogsModel
    }
    /**
     * @param { logDataModel } params 
     */
    async $logItem({ who, involved, action, model = undefined, humanReadableMessage, payload = {}  }, session) {
        if (!model)
            model = this.model.collection.collectionName

        return await this.logSchema({ who, involved, action, model, humanReadableMessage, payload }).save({ session });
    }

    async $getById(id) {
        id = this.convertToObjectId(id)

        return await this.model.findOne({ _id: id })
    }

    async $list(query) {
        const recordModel = await this.model.find(query);
        return recordModel;
    }

    async $findOne(query) {
        return await this.model.findOne(query);
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

    /**
     * 
     * @param { object } params 
     * @param { object } params.query - Query de deleção 
     * @param { logDataModel } params.logData - Dados para criação de log 
     */
    async $deleteMany({ query, logData }, session) {
        let deletedData = undefined

        if (session)
            deletedData = await this.model.deleteMany(query).session(session);
        else
            deletedData = await this.model.deleteMany(query);

        if (deletedData.ok === 1) {
            await this.$logItem({ ...logData }, session)
            return true
        }
        
        return false
    }

    async $listAggregate(aggregationPipeline, session) {
        if (session)
            return await this.model.aggregate(aggregationPipeline).session(session).exec();

        return await this.model.aggregate(aggregationPipeline).exec();
    }

    /**
     * @description Função genérica responsável por paginar uma model de acordo com uma query e busca.
     * @param { object } params 
     * @param { string | Number } params.page - Número da página atual
     * @param { string | Number } params.limit - Limite de itens por página
     * @param { Array<string> } [params.searchFields = []] - Array com as chaves (atributos) que serão considerados ao se realizar a busca
     * @param { string } [params.search = undefined ] - Termo que será buscado
     * @param { object } [params.itemQuery = []] - Pipeline que será executado. Opcional
     * @param { object } [params.autoPopulateId = false] - Se o campo 'id' deve ser adicionado automáticamente. Opcional
     * @returns { Promise<boolean | object> }
     */
    async $paginate({ page, limit, searchFields = [], search = "", pipeline = [], autoPopulateId = false }) {
        const initialPipeline = [
            ...pipeline,
            ...(!!search.length ? [{
				'$match': {
                    '$or': searchFields.map(field => ({ [field]: {'$regex': search, '$options': 'i'} }))
				}
            }] : []),
            ...(autoPopulateId ? [{
                '$addFields': {
                    'id': {
                        '$toString':'$_id'
                    }
                }
            },] : []),
            
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

    convertToObjectId(value) {
        if (typeof value === "string")
            value = Types.ObjectId(value)

        return value
    }
}

/**
 * @typedef { object } logDataModel
 * @property { Types.ObjectId } who - ObjectId de quem gerou a ação
 * @property { Array<Types.ObjectId> } involved - Array de ObjectIds dos envolvidos
 * @property { string } action - Ação realizada
 * @property { string } [model = this.model.collection.collectionName ] - Collection na qual a ação foi realizada
 * @property { string } humanReadableMessage - Mensagem que será consumida pelo client descrevendo o log
 * @property { object } [payload = {}] - Payload adicional do log
 * 
 * 
 */
/**
 * @template T
 * @typedef { object } paginatedResponse
 * @property { Array<T> } items - Array de itens paginados
 * @property { number } numberOfItemsInPage - Número de itens na página atual
 * @property { number } currentPage - Página atual
 * @property { number } totalPages - Número total de páginas
 * @property { number } totalItems - Número total de itens
 * 
 */
module.exports = BaseRepository
