const { hashHandlerInstance } = require("../lib/auth/HashHandler");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const StudentRepository = require("../repositories/mongo/StudentRepository");
const BaseService = require("./BaseService");

class StudentService extends BaseService {
    constructor() {
        super();
        this.repository = new StudentRepository();
    }

    async createStudent({ name, email, cellPhone, password, repeatedPassword }) {
        hashHandlerInstance.validatePassword({ repeatedPassword, password })

        const hashedPassword = await hashHandlerInstance.hashPassword(password);

        const createdStudent = await this.repository.$save({ name, email, cellPhone, password: hashedPassword })

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

    async listTeachers({ page, limit, search, studentId }) {
        const response = await this.repository.listTeachers({ page, limit, search, studentId });

        if (!response) 
            throw new NotFoundException("Nenhum professor encontrado para o aluno informado", { page, limit, search, studentId })
        
        return response;
    }
}

module.exports = StudentService