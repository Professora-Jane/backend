const { Types } = require("mongoose");
const RoomModel = require("../../models/RoomModel");
const BaseRepository = require("./BaseRepository");

class RoomRepository extends BaseRepository {
    constructor() {
        super(RoomModel)
    }

    /**
     * 
     * @param { object } params 
     * @param { string|Types.ObjectId } params.adminId Id de quem criou a sala
     * 
     * @returns { room } 
     */
    async getCurrentRoom({ adminId }) {
        return await this.$findOne({
            admin: this.convertToObjectId(adminId),
            endTime: {
                "$exists": false
            }
        })
    }

    /**
     * 
     * @param {object} param0
     * @param { string|Types.ObjectId } adminId
     * 
     * @returns {Promise<import("./BaseRepository").paginatedResponse<room>>} 
     */
    async listFinishedRooms({ adminId, page, limit, search, sort, sortType }) {
        if (typeof adminId === "string")
            adminId = Types.ObjectId(adminId);

        const searchFields = [ "name", "status" ]
                
        const pipeline = [
            {
                '$match': {
                    'admin': adminId,
                    'endTime': {
                        '$exists': true
                    }
                }
            }
        ]

        const response = await this.$paginate({ page, limit, pipeline, search, searchFields, sort, sortType })

        return response;
    }
}

/**
 * @typedef { object } room
 * @property { Types.ObjectId } admin - ObjectId de quem gerou a ação
 * @property { string } name - Nome da sala
 * @property { string } status - Status da sala
 * @property { boolean } active - Se a sala está ativa ou não
 * @property { Date } startTime - Data e hora em que a sala foi iniciada
 * @property { Date } endTime - Data e hora em que a sala foi finalizada
 * @property { Date } creationDate - Data de criação do document
 * @property { Date } lastUpdateDate - Data de última atualização do document
 * 
 */
module.exports = RoomRepository