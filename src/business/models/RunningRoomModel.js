const Nohm = require('nohm').Nohm;
const NohmModel = require('nohm').NohmModel;

class CurrentRoomModel extends NohmModel {

}
CurrentRoomModel.modelName = "CurrentRoom"
CurrentRoomModel.definitions = {
    roomId: {
        type: "string",
        index: true
    },
    currentParticipants: {
        type: "json"
    },
    banned: {
        type: "json"
    },
    admin: {
        type: "string"
    },
    startTime: {
        type: "string"
    },
    canvasStatus: {
        type: "boolean"
    }
}

module.exports = Nohm.register(CurrentRoomModel)