const { roomsManagerInstance } = require("../../../business/roomManager/RoomsManager")
const BaseWsController = require("./BaseController")

const ROOM_JOIN = "on_room:join"
const ROOM_LEAVE = "on_room:leave"
const ROOM_CHAT = "on_room:chat"
const ROOM_PARTICIPANT_JOIN = "room:participantJoin"
const ROOM_PARTICIPANT_LEAVE = "room:participantLeave"

class RoomController  extends BaseWsController {
    constructor() {
        super()
    }

    [ROOM_JOIN]({ roomId, participantId, participantName }) {
        if(roomsManagerInstance.addParticipant({ roomId, participantId, participantName }))    
        roomsManagerInstance.broadcastMessageToRoom({
            roomId,
            type: ROOM_PARTICIPANT_JOIN,
            content: {
                user: {
                    name: participantName,
                    id: participantId
                },
                currentUsers: roomsManagerInstance.getRoomDetails({ roomId }).currentParticipants
            }
        })
    }
    
    [ROOM_LEAVE]({ roomId, participantId }) {
        const removedParticipant = roomsManagerInstance.removeParticipant({ roomId, participantId })
        if(removedParticipant)    
            roomsManagerInstance.broadcastMessageToRoom({
                roomId,
                type: ROOM_PARTICIPANT_LEAVE,
                content: {
                    user: {
                        name: removedParticipant[0].name,
                        id: removedParticipant[0].id
                    },
                    currentUsers: roomsManagerInstance.getRoomDetails({ roomId }).currentParticipants
                }
            })
    }
    
    [ROOM_CHAT]({ roomId, participantId, participantName, messageContent }) {

        roomsManagerInstance.broadcastMessageToRoom({
            roomId,
            type: ROOM_CHAT.replace("on_", ""),
            content: {
                senderId: participantId,
                name: participantName,
                content: messageContent,
                type: "message"
            }
        })
    }
}

module.exports = new RoomController()
