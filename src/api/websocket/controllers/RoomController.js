const RoomManagetService = require("../../../business/services/RoomManagerService")
const { wsConnectionsInstance } = require("../wsConnections")
const BaseWsController = require("./BaseController")
const {
    ROOM_JOIN,
    ROOM_LEAVE,
    ROOM_CHAT,
    ROOM_PEER_OFFER,
    ROOM_PARTICIPANT_JOIN,
    ROOM_PARTICIPANT_LEAVE,
} = require("../topics/eventTopics")



class RoomController  extends BaseWsController {
    constructor() {
        super()
        this.roomManagerService = new RoomManagetService()
    }

    async [ROOM_JOIN]({ roomId, participantId, participantName }) {
        if(await this.roomManagerService.addParticipant({ roomId, participantId, participantName })) {
            await this.roomManagerService.broadcastMessageToRoom({
                roomId,
                type: ROOM_PARTICIPANT_JOIN,
                content: {
                    user: {
                        name: participantName,
                        id: participantId
                    },
                },
                appendCurrentParticipants: true
            })
        }
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
                    currentUsers: await this.roomManagerService.getRoomDetails({ roomId }).currentParticipants
                },
                appendCurrentParticipants: true
            })
    }
    
    async [ROOM_PEER_OFFER]({ offer, participantId, roomId, to }) {
        const room = await this.roomManagerService.getRoomDetails({ roomId })

        if (room && room.currentParticipants.length) {
            room.currentParticipants
                .filter(participant => participant.id === to)
                .map(participant => {
                    if (wsConnectionsInstance.getSockets(participant.id)) {
                        wsConnectionsInstance.getSockets(participant.id).map(ws => {
                            ws.send(ROOM_PEER_OFFER, { offer, participantId })
                        })
                    } 
                })
        }
    }
    
    async [ROOM_CHAT]({ roomId, participantId, participantName, messageContent }) {

        await this.roomManagerService.broadcastMessageToRoom({
            roomId,
            type: ROOM_CHAT,
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
