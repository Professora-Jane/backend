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

    async [ROOM_JOIN]({ roomId, participantId, participantName }) {
        if(await roomsManagerInstance.addParticipant({ roomId, participantId, participantName }))    
        await roomsManagerInstance.broadcastMessageToRoom({
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
    
    async [ROOM_LEAVE]({ roomId, participantId }) {
        const removedParticipant = await roomsManagerInstance.removeParticipant({ roomId, participantId })
        if(removedParticipant)    
            await roomsManagerInstance.broadcastMessageToRoom({
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
    
    async [ROOM_CHAT]({ roomId, participantId, participantName, messageContent }) {

        await roomsManagerInstance.broadcastMessageToRoom({
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
