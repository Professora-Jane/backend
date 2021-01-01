const { Types, Model } = require("mongoose");
const DateAndTimeUtils = require("../lib/DateAndTimeUtil");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const RoomRepository = require("../repositories/RoomRepository");
const BaseService = require("./BaseService");
const TeacherService = require("./TeacherService");

class RoomService extends BaseService {
    constructor() {
        super()
        this.repository = new RoomRepository();
        this.teacherService = new TeacherService();
    }

    async create({ teacherId }) {
        const teacher = await this.teacherService.findById({ id: teacherId });

        const response = await this.repository.$save({
            admin: teacher._id,
            active: false
        })

        return response;
    }

    /**'
     * 
     * @param { object } params 
     * @param { string| Types.ObjectId } params.id - Id da sala
     * 
     * @returns  { Promise<import("../repositories/RoomRepository").room> }
     */
    async findById({ id }) {

        const room = await this.repository.$getById({ id });
        
        if (!room)
            throw new NotFoundException("Sala não encontrada", { id })

        return room;
    }

    async startRoom({ id }) {
        const room = await this.findById({ id });

        room.active = true;
        room.startTime = DateAndTimeUtils.getDateWithTz();

        const updatedRoom = await this.repository.$update(room);
        
        return updatedRoom;
    }
    
    async finishRoom({ id }) {
        const room = await this.findById({ id });

        room.active = false;
        room.endTime = DateAndTimeUtils.getDateWithTz();

        const updatedRoom = await this.repository.$update(room);
        
        return updatedRoom;
    }

}

module.exports = RoomService
