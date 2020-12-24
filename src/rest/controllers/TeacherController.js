class TeacherController {
    constructor() {

    }

    async getTeacher() {
        return { hello: 'world' }
    }

    async createTeacher(req, res) {
        const { name, email } = req.body

        return { success: true }
    }
}

module.exports = TeacherController;