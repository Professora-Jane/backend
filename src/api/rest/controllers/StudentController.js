const StudentService = require("../../../business/services/StudentService");
const { FastifyReply, FastifyRequest } = require("fastify");

class StudentController {
    constructor() {
        this.studentService = new StudentService();
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */ 
    async getById(req, res) {
        const { id } = req.params;

        const response = await this.studentService.findById({ id });

        res
            .code(200)
            .send(response)
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async createStudent(req, res) {
        const { name, email, cellPhone } = req.body
        
        const response = await this.studentService.createStudent({ name, email, cellPhone })
        
        res
            .code(201)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async listByTeacherId(req, res) {
        const { id } = req.params
        const { page = 1, limit = 20, search = "" } = req.query
        
        const response = await this.studentService.listByTeacherId({ page, limit, search, teacherId: id })
        
        res
            .code(200)
            .send(response);
    }
}

module.exports = StudentController
