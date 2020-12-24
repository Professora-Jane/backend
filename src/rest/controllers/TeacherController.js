const TeacherService = require("../../business/services/TeacherService")

class TeacherController {
    constructor() {
        this.teacherService = new TeacherService();
    }

    async getTeacher() {
        return { hello: 'world' }
    }

    async createTeacher(req, res) {
        const { name, email } = req.body
        
        const response = await this.teacherService.createTeacher({ name, email })

        return response.id
    }
}

module.exports = TeacherController;