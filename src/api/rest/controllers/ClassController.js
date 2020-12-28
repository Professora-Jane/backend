const ClassService = require("../../../business/services/ClassService");
const { IdResponse } = require("../responseModels/IdResponseModel");
const { FastifyReply, FastifyRequest } = require("fastify");

class ClassController {
    constructor() {
        this.teacherStudentClassService = new ClassService();
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */    
    async getClass(req, res) {
        const { id } = req.params

        const response = await this.teacherStudentClassService.findById({ id });

        res
            .code(200)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */    
    async createClass(req, res) {
        const { 
            studentId,
            teacherId,
            startTime,
            endTime,
            daysOfWeek,
            discipline
        } = req.body

        const response = await this.teacherStudentClassService.create({ 
            studentId,
            teacherId,
            startTime,
            endTime,
            daysOfWeek,
            discipline 
        });

        res
            .code(200)
            .send(new IdResponse(response));
    }
}

module.exports = ClassController
