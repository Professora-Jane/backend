const TeacherService = require("../../business/services/TeacherService")
const { IdResponse } = require("../responseModels/IdResponseModel");

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

        return new IdResponse(response);
    }
}

module.exports = TeacherController;