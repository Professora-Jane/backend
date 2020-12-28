const TeacherStudentClassService = require("../../../business/services/TeacherStudentClassService");
const { IdResponse } = require("../responseModels/IdResponseModel");
const { FastifyReply, FastifyRequest } = require("fastify");

class TeacherStudentClassController {
    constructor() {
        this.teacherStudentClassService = new TeacherStudentClassService();
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

module.exports = TeacherStudentClassController
