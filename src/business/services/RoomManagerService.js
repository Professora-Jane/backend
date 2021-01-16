const { wsConnectionsInstance } = require("../../api/websocket/wsConnections");
const DateAndTimeUtils = require("../lib/DateAndTimeUtil");
const ConflictException = require("../lib/httpExceptions/ConflictException");
const CurrentRoomRepository = require("../repositories/redis/CurrentRoomRepository");

class RoomManagerService  {
    constructor() {
        this.roomsRepository = new CurrentRoomRepository()
    }
    
    async startRoom({ roomId, adminId }) {
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

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

    async addParticipant({ roomId, participantId, participantName }) {
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

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
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

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
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

        if (!currentRoom)
            return false

        this.removeParticipant({ roomId, participantId })

        currentRoom.banned.push(participantId)

        await this.roomsRepository.$update(currentRoom);
        
        return true
    }

    async unBanParticipant({ roomId, participantId }) {
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

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
     * 
     * @returns { roomDescription } 
     */
    async getRoomDetails({ roomId }) {
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

        if (!currentRoom)
            return false

        return currentRoom
    }

    async finishRoom({ roomId }) {
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

        if (currentRoom)
            await this.roomsRepository.$deleteOne(currentRoom)

        return true
    }

    async broadcastMessageToRoom({ roomId, type, content }) {
        const currentRoom = await this.roomsRepository.$findOne({ roomId });

        if (!currentRoom)
            return false
        
        currentRoom.currentParticipants.map(participant => {
            if (wsConnectionsInstance.getSockets(participant.id)) {
                wsConnectionsInstance.getSockets(participant.id).map(ws => {
                    ws.send(type, content)
                })
            } 
        })

        return true
    }
}

module.exports = RoomManagerService