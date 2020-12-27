const TeacherRepository = require("../repositories/TeacherRepository");
const BaseService = require("./BaseService");

class TeacherService extends BaseService {

    constructor() {
        super(TeacherRepository)
    }

    async createTeacher({ name, email }) {
        const createdTeacher = await this.repository.$save({ name, email })
        
        return createdTeacher;
    }
    
    async updateTeacher({ name, email, active, id }) {
        const currentTeacher = await this.findById({ id })

        currentTeacher.name = name ?? currentTeacher.name
        currentTeacher.email = email ?? currentTeacher.email
        currentTeacher.active = active ?? currentTeacher.active

        const updatedTeacher = await this.repository.$update(currentTeacher)
        
        return updatedTeacher;
    }
}

module.exports = TeacherService