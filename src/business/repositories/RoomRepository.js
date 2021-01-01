const RoomModel = require("../models/RoomModel");
const BaseRepository = require("./BaseRepository");

class RoomRepository extends BaseRepository {
    constructor() {
        super(RoomModel)
    }
}

/**
 * @typedef { object } room
 * @property { Types.ObjectId } admin - ObjectId de quem gerou a ação
 * @property { boolean } active - Se a sala está ativa ou não
 * @property { Date } startTime - Data e hora em que a sala foi iniciada
 * @property { Date } endTime - Data e hora em que a sala foi finalizada
 * @property { Date } creationDate - Data de criação do document
 * @property { Date } lastUpdateDate - Data de última atualização do document
 * 
 */
module.exports = RoomRepository