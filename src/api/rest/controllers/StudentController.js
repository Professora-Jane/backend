const StudentService = require("../../../business/services/StudentService");
const { FastifyReply, FastifyRequest } = require("fastify");
const ClassService = require("../../../business/services/ClassService");

class StudentController {
    constructor() {
        this.studentService = new StudentService();
        this.classService = new ClassService();
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
        const { name, email, cellPhone, password, repeatedPassword } = req.body
        
        const response = await this.studentService.createStudent({ name, email, cellPhone, password, repeatedPassword })
        
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
    
    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async listClasses(req, res) {
        const { id } = req.params
        const { teacherId = undefined } = req.query
        
        const response = await this.classService.getStudentClasses({ studentId: id, teacherId })
        
        res
            .code(200)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async listTeachers(req, res) {
        const { id } = req.params
        const { page = 1, limit = 20, search = "" } = req.query
        
        const response = await this.studentService.listTeachers({ page, limit, search, studentId: id })
        
        res
            .code(200)
            .send(response);
    }
}

module.exports = StudentController
