const StudentRepository = require("../repositories/StudentRepository");
const BaseService = require("./BaseService");

class StudentService extends BaseService {
    constructor() {
        super(StudentRepository);
    }

    async createStudent({ name, email, cellPhone }) {
        const createdStudent = await this.repository.$save({ name, email, cellPhone })

        return createdStudent
    }
    
    async update({ name, email, cellPhone, active,  id }) {
        const currentStudent = await this.findById({ id })

        currentStudent.name = name ?? currentStudent.name
        currentStudent.email = email ?? currentStudent.email
        currentStudent.cellPhone = cellPhone ?? currentStudent.cellPhone
        currentStudent.active = active ?? currentStudent.active

        const updatedStudent = await this.repository.$update(currentStudent)

        return updatedStudent;
    }
}

module.exports = StudentService