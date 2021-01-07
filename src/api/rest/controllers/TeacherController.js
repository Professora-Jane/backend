const TeacherService = require("../../../business/services/TeacherService")
const { FastifyReply, FastifyRequest } = require("fastify");
const TeacherStudentService = require("../../../business/services/TeacherStudentService");

class TeacherController {
    constructor() {
        this.teacherService = new TeacherService();
        this.teacherStudentService = new TeacherStudentService();
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */    
    async getTeacher(req, res) {
        const { id } = req.params

        const response = await this.teacherService.findById({ id });

        res
            .code(200)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */    
    async listTeacherClasses(req, res) {
        const { id } = req.params
        const { studentId = undefined } = req.query

        const response = await this.teacherService.listTeacherClass({ teacherId: id, studentId });

        res
            .code(200)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async createTeacher(req, res) {
        const { name, email, password, repeatedPassword } = req.body
        
        const response = await this.teacherService.createTeacher({ name, email, password, repeatedPassword })
        
        res
            .code(201)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async createTeacherStudent(req, res) {
        const { studentId, studentEmail, teacherId } = req.body

        const response = await this.teacherStudentService.create({ studentId, studentEmail, teacherId })

        res
            .code(201)
            .send(response);
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async updateTeacher(req, res) {
        const { name, email, active } = req.body
        const { id } = req.params
        
        await this.teacherService.updateTeacher({ name, email, active, id })

        res
            .code(200)
            .send();
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async deleteTeacherStudent(req, res) {
        const { teacherId, studentId } = req.params
        
        await this.teacherStudentService.deleteTeacherStudent({ teacherId, studentId })

        res
            .code(200)
            .send();
    }


}

module.exports = TeacherController;