const { wsConnectionsInstance } = require("../../api/websocket/wsConnections");
const DateAndTimeUtils = require("../lib/DateAndTimeUtil");
const ConflictException = require("../lib/httpExceptions/ConflictException");

// TODO substituir essa implementação em memória por uma utilizando o REDIS
class RoomsManager {
    /**
     * @typedef { object } participant
     * @property { string } name Nome do participante
     * @property { string } id Id do participante
     */
    
    /**
     * @typedef { object } roomDescription
     * @property { Array<participant> } currentParticipants - participantes atualmente na sala
     * @property { Array<participant> } banned - Array de participantes banidos
     * @property { string } admin - ObjectId do admin da sala
     * @property { Date } startTime - Tempo de inicio da sala
     * @property { Date? } endTime - Tempo de fechamento da sala
     */

    /** 
     * @type {Map<string, roomDescription>}
     */
    #rooms = new Map();
    
    startRoom({ roomId, adminId }) {
        const currentRoom = this.#rooms.get(roomId);

        // Não faço nada caso a sala já exista
        if (currentRoom)
            return false

        this.#rooms.set(roomId, {
            currentParticipants: [],
            banned: [],
            admin: adminId,
            startTime: DateAndTimeUtils.getDateWithTz()
        })

        return true
    }

    addParticipant({ roomId, participantId, participantName }) {
        const currentRoom = this.#rooms.get(roomId);

        if (!currentRoom)
            return false

        if (currentRoom.banned.includes(participantId))
            throw new ConflictException("Usuário banido!!")

        currentRoom.currentParticipants.push({
            id: participantId,
            name: participantName
        })

        return true
    }

    removeParticipant({ roomId, participantId }) {
        const currentRoom = this.#rooms.get(roomId);

        if (!currentRoom)
            return false

        const participantIndex = currentRoom.currentParticipants.findIndex(participant => participant.id === participantId);

        if (participantIndex === -1)
            return false 
        
        return currentRoom.currentParticipants.splice(participantIndex, 1)
    }

    banParticipant({ roomId, participantId }) {
        const currentRoom = this.#rooms.get(roomId);

        if (!currentRoom)
            return false

        this.removeParticipant({ roomId, participantId })

        currentRoom.banned.push(participantId)

        return true
    }

    unBanParticipant({ roomId, participantId }) {
        const currentRoom = this.#rooms.get(roomId);

        if (!currentRoom)
            return false

        const participantIndex = currentRoom.banned.findIndex(participant => participant.id === participantId);

        if (participantIndex === -1)
            return false
        
        currentRoom.banned.splice(participantIndex, 1)

        return true
    }

    /**
     * 
     * @param {*} param0
     * 
     * @returns { roomDescription } 
     */
    getRoomDetails({ roomId }) {
        const currentRoom = this.#rooms.get(roomId);

        if (!currentRoom)
            return false

        return currentRoom
    }

    finishRoom({ roomId }) {
        const currentRoom = this.#rooms.get(roomId);

        if (currentRoom)
            this.#rooms.delete(roomId)

        return true
    }

    broadcastMessageToRoom({ roomId, type, content }) {
        const currentRoom = this.#rooms.get(roomId);

        if (!currentRoom)
            return false
        
        currentRoom.currentParticipants.map(participant => {
            wsConnectionsInstance.getSockets(participant.id).map(ws => {
                ws.send(type, content)
            })
        })

        return true
    }
}

const instance = new RoomsManager();

module.exports = {
    roomsManagerInstance: (() => instance)()
}