const { Types, Model } = require("mongoose");
const DateAndTimeUtils = require("../lib/DateAndTimeUtil");
const ConflictException = require("../lib/httpExceptions/ConflictException");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const RoomRepository = require("../repositories/mongo/RoomRepository");
const BaseService = require("./BaseService");
const RoomManagerService = require("./RoomManagerService");
const TeacherService = require("./TeacherService");

class RoomService extends BaseService {
    constructor() {
        super()
        this.repository = new RoomRepository();
        this.teacherService = new TeacherService();
        this.roomManagerService = new RoomManagerService();
    }

    async create({ adminId, name }) {
        
        const currentRoom = await this.getCurrrentRoom({ adminId }, false)
        
        if (currentRoom)
            throw new ConflictException("Já existe uma sala atual. Inicie ou finalize ela antes de criar uma nova");
    
        const response = await this.repository.$save({
            admin: adminId,
            active: false,
            name,
            status: "criado"
        })

        return response;
    }

    /**
     * 
     * @param { object } params 
     * @param { string| Types.ObjectId } params.id - Id da sala
     * 
     * @returns  { Promise<import("../repositories/RoomRepository").room> }
     */
    async findById({ id }) {

        const room = await this.repository.$getById(id);
        
        if (!room)
            throw new NotFoundException("Sala não encontrada", { id })
        
        const roomDetails = await this.roomManagerService.getRoomDetails({ roomId: room.id })
        
        if (room.status === "andamento" && roomDetails)
            room.details = roomDetails

        return room;
    }

    async startRoom({ id }) {
        const room = await this.findById({ id });

        room.active = true;
        room.startTime = DateAndTimeUtils.getDateWithTz();
        room.status = "andamento"

        const updatedRoom = await this.repository.$update(room);

        await this.roomManagerService.startRoom({ roomId: room.id, adminId: room.admin.toHexString() })
        
        return updatedRoom;
    }
    
    async finishRoom({ id }) {
        const room = await this.findById({ id });

        room.active = false;
        room.endTime = DateAndTimeUtils.getDateWithTz();
        room.status = "finalizado"

        const updatedRoom = await this.repository.$update(room);
        
        return updatedRoom;
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.adminId ObjectiId do admin da reunião
     * @param { boolean } [throwError = true] - Se a função deve lançar uma exceção ou somente retornar o valor encontrado
     */
    async getCurrrentRoom({ adminId }, throwError = true) {
        const currentRoom = await this.repository.getCurrentRoom({ adminId })

        if (!currentRoom && throwError)
            throw new NotFoundException("Sala atual não encontrada");

        return currentRoom
    };

    async listFinishedRooms({ page, limit, adminId }) {
        const paginatedRooms = await this.repository.listFinishedRooms({ page, limit, adminId });

        if(!paginatedRooms)
        throw new NotFoundException("Não foram encontradas salas finalizadas");

        return paginatedRooms
    }
}

module.exports = RoomService
