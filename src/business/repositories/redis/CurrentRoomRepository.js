const CurrentRoomModel = require("../../models/RunningRoomModel");
const BaseRepository = require("./BaseRepository");

class CurrentRoomRepository extends BaseRepository {
    constructor() {
        super(CurrentRoomModel)
    }
}

module.exports = CurrentRoomRepository