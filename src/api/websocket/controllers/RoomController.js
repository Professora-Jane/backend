const RoomManagetService = require("../../../business/services/RoomManagerService")
const BaseWsController = require("./BaseController")

const ROOM_JOIN = "on_room:join"
const ROOM_LEAVE = "on_room:leave"
const ROOM_CHAT = "on_room:chat"
const ROOM_PEER_OFFER = "on_room:peerOffer"
const ROOM_PARTICIPANT_JOIN = "room:participantJoin"
const ROOM_PARTICIPANT_LEAVE = "room:participantLeave"

class RoomController  extends BaseWsController {
    constructor() {
        super()
        this.roomManagerService = new RoomManagetService()
    }

    async [ROOM_JOIN]({ roomId, participantId, participantName }) {
        if(await this.roomManagerService.addParticipant({ roomId, participantId, participantName }))    
        await this.roomManagerService.broadcastMessageToRoom({
            roomId,
            type: ROOM_PARTICIPANT_JOIN,
            content: {
                user: {
                    name: participantName,
                    id: participantId
                },
                currentUsers: this.roomManagerService.getRoomDetails({ roomId }).currentParticipants
            }
        })
    }
    
    async [ROOM_LEAVE]({ roomId, participantId }) {
        const removedParticipant = await this.roomManagerService.removeParticipant({ roomId, participantId })
        if(removedParticipant)    
            await this.roomManagerService.broadcastMessageToRoom({
                roomId,
                type: ROOM_PARTICIPANT_LEAVE,
                content: {
                    user: {
                        name: removedParticipant[0].name,
                        id: removedParticipant[0].id
                    },
                    currentUsers: this.roomManagerService.getRoomDetails({ roomId }).currentParticipants
                }
            })
    }
    
    async [ROOM_PEER_OFFER]({ offer, participantId, roomId }) {
        await this.roomManagerService.broadcastMessageToRoom({
            roomId,
            type: ROOM_PEER_OFFER.replace("on_", ""),
            content: { offer, participantId }
        })
    }
    
    async [ROOM_CHAT]({ roomId, participantId, participantName, messageContent }) {

        await this.roomManagerService.broadcastMessageToRoom({
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
