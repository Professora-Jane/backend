const { FastifyReply, FastifyRequest } = require("fastify");
const RoomService = require("../../../business/services/RoomService");

class RoomController {

    constructor() {
        this.roomService = new RoomService();
    }


    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async createRoom(req, res) {
        const { adminId, name } = req.body
        
        const response = await this.roomService.create({ adminId, name })
        
        res
            .code(201)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async getRoomById(req, res) {
        const { id } = req.params
        
        const response = await this.roomService.findById({ id })
        
        const jsonToSend = response.toJSON()

        jsonToSend.details = response.details

        res
            .code(200)
            .send(jsonToSend);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async getCurrentRoom(req, res) {
        const { id } = req.params
        
        const response = await this.roomService.getCurrrentRoom({ adminId: id })
        
        res
            .code(200)
            .send(response);
    }
    
    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async startRoom(req, res) {
        const { id } = req.params
        
        await this.roomService.startRoom({ id })
        
        res
            .code(204)
            .send();
    }
    
    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async listFinishedRooms(req, res) {
        const { id } = req.params
        const { page = 1, limit = 20 } = req.params
        
        const response = await this.roomService.listFinishedRooms({ adminId: id, page, limit })
        
        res
            .code(200)
            .send(response);
    }
}

module.exports = RoomController