const DisciplineService = require("../../../business/services/DisciplineService");
const { IdResponse } = require("../responseModels/IdResponseModel");
const { FastifyReply, FastifyRequest } = require("fastify");

class StudentController {
    constructor() {
        this.disciplineService = new DisciplineService();
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */ 
    async getById(req, res) {
        const { id } = req.params;

        const response = await this.disciplineService.findById({ id });

        res
            .code(200)
            .send(response)
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async createDiscipline(req, res) {
        const { name, description } = req.body
        
        const response = await this.disciplineService.createDiscipline({ name, description })
        
        res
            .code(201)
            .send(new IdResponse(response));
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async listDisciplines(req, res) {
        const { page = 1, limit = 20, search = "" } = req.query
        
        const response = await this.disciplineService.listDisciplines({ page, limit, search })
        
        res
            .code(200)
            .send(response);
    }
}

module.exports = StudentController
