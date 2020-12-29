const NotFoundException = require("../lib/httpExceptions/NotFoundException");
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

    async getStudentByEmail({ email }) {
        const student = await this.repository.$findOne({ email });

        if (!student)
            throw new NotFoundException("Nenhum estudante encontrado para o email informado", { email })

        return student
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

    async listByTeacherId({ page, limit, search, teacherId }) {
        const response = await this.repository.listStudentsByTeacherId({ page, limit, search, teacherId });

        if (!response) 
            throw new NotFoundException("Nenhum aluno encontrado para os termos fornecidos", { page, limit, search, teacherId })
        
        return response;
    }
}

module.exports = StudentService