const CurrentRoomModel = require("../../models/RunningRoomModel");
const BaseRepository = require("./BaseRepository");

class CurrentRoomRepository extends BaseRepository {
    constructor() {
        super(CurrentRoomModel)
    }
}

/**
 * @typedef {Object} Room
 * @property {string} id - O id do processo
 * @property {Array<{ name: string, id: string }>} currentParticipants - Array de participantes ativos
 * @property {Array<String>} banned - Array de pessoas banidas da sala
 * @property {string} admin - Id do admin da sala 
 * @property {Boolean} canvasStatus  - Booleando que indica se a sala está  
 */
 /**
 * @method
 * @name $findOne
 * @returns { Room } Description of return value.
 */
 module.exports = CurrentRoomRepository
