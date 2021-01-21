const { ROOM_FINISH } = require("../../api/websocket/topics/eventTopics");
const { wsConnectionsInstance } = require("../../api/websocket/wsConnections");
const DateAndTimeUtils = require("../lib/DateAndTimeUtil");
const ConflictException = require("../lib/httpExceptions/ConflictException");
const CurrentRoomRepository = require("../repositories/redis/CurrentRoomRepository");

class RoomManagerService  {
    constructor() {
        this.roomsRepository = new CurrentRoomRepository()
    }
    
    async startRoom({ roomId, adminId }) {
        const currentRoom = await this.getRoomDetails({ roomId });

        // Não faço nada caso a sala já exista
        if (currentRoom)
            return false

        await this.roomsRepository.$save({
            roomId,
            currentParticipants: [],
            banned: [],
            admin: adminId,
            startTime: DateAndTimeUtils.getDateWithTz()
        })

        return true
    }

    async finishRoom({ roomId }) {
        const currentRoom = await this.getRoomDetails({ roomId });

        if (!currentRoom)
            return false
        
        await this.broadcastMessageToRoom({
            roomId,
            type: ROOM_FINISH
        })

        await this.roomsRepository.$deleteOne(currentRoom)

        return true
    }

    async addParticipant({ roomId, participantId, participantName }) {
        const currentRoom = await this.getRoomDetails({ roomId });

        if (!currentRoom)
            return false

        if (currentRoom.banned.includes(participantId))
            throw new ConflictException("Usuário banido!!")

        if (currentRoom.currentParticipants.findIndex(item => item.id === participantId) === -1) {
            currentRoom.currentParticipants.push({
                id: participantId,
                name: participantName
            })

            await this.roomsRepository.$update(currentRoom);

        }

        return true
    }

    async removeParticipant({ roomId, participantId }) {
        const currentRoom = await this.getRoomDetails({ roomId });

        if (!currentRoom)
            return false

        const participantIndex = currentRoom.currentParticipants.findIndex(participant => participant.id === participantId);

        if (participantIndex === -1)
            return false 

        const removed = currentRoom.currentParticipants.splice(participantIndex, 1)

        await this.roomsRepository.$update(currentRoom);
        
        return removed 
    }

    async banParticipant({ roomId, participantId }) {
        const currentRoom = await this.getRoomDetails({ roomId });

        if (!currentRoom)
            return false

        this.removeParticipant({ roomId, participantId })

        currentRoom.banned.push(participantId)

        await this.roomsRepository.$update(currentRoom);
        
        return true
    }

    async unBanParticipant({ roomId, participantId }) {
        const currentRoom = await this.getRoomDetails({ roomId });

        if (!currentRoom)
            return false

        const participantIndex = currentRoom.banned.findIndex(participant => participant.id === participantId);

        if (participantIndex === -1)
            return false
        
        currentRoom.banned.splice(participantIndex, 1)

        await this.roomsRepository.$update(currentRoom);

        return true
    }

    /**
     * 
     * @param {*} param0
     */
    async getRoomDetails({ roomId }) {
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

        if (!currentRoom)
            return false

        return currentRoom
    }

    /**
     * 
     * @param { object } params 
     * @param { String } params.roomId Id da sala
     * @param { String } params.type Tópico que será enviado aos clients
     * @param { String } [params.selfId] Id do sender
     * @param { Boolean } [params.sendToSelf] Se a mensagem deve ser enviada ao sender 
     * @param { Boolean } [params.appendCurrentParticipants] Se deve-se adicionar a lista de participantes atuais no conteúdo da mensagem 
     */
    async broadcastMessageToRoom({ roomId, type, content, selfId = undefined, sendToSelf = true, appendCurrentParticipants = false }) {
        const currentRoom = await this.getRoomDetails({ roomId });

        if (type.includes("on_"))
            type = type.replace("on_", "")

        if (!currentRoom)
            return false

        if (appendCurrentParticipants)
            content.currentParticipants = currentRoom.currentParticipants
        
        currentRoom.currentParticipants.map(participant => {
            if (wsConnectionsInstance.getSockets(participant.id)) {
                

                if(!sendToSelf) {
                    if (selfId !== participant.id) {
                        wsConnectionsInstance.getSockets(participant.id).map(ws => {
                            ws.send(type, content)
                        })
                    }
                }
                else {
                    wsConnectionsInstance.getSockets(participant.id).map(ws => {
                        ws.send(type, content)
                    })
                }

            } 
        })
        return true
    }
}

module.exports = RoomManagerService