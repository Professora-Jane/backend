const TeacherRepository = require("../repositories/TeacherRepository");
const BaseService = require("./BaseService");

class TeacherService extends BaseService {
    constructor() {
        super()
        this.teacherRepository = new TeacherRepository();
    }

    async createTeacher({ name, email }) {
        const createdTeacher = await this.teacherRepository.$save({ name, email })
        
        return createdTeacher;
    }
}

module.exports = TeacherService