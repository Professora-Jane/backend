const TeacherRepository = require("../repositories/TeacherRepository");
const BaseService = require("./BaseService");

class TeacherService extends BaseService {
    constructor() {
        super()
        this.teacherRepository = new TeacherRepository();
    }

    async findById({ id }) {
        const teacher = await this.teacherRepository.$getById(id);

        if (!id)
            throw new Error("Not found")
        
        return teacher;
    }

    async createTeacher({ name, email }) {
        const createdTeacher = await this.teacherRepository.$save({ name, email })
        
        return createdTeacher;
    }
}

module.exports = TeacherService