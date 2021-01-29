const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const TeacherRepository = require("../repositories/mongo/TeacherRepository");
const BaseService = require("./BaseService");
const { hashHandlerInstance } = require("../lib/auth/HashHandler");


class TeacherService extends BaseService {

    constructor() {
        super()
        this.repository = new TeacherRepository();
    }


    async createTeacher({ name, email, password, repeatedPassword }) {
        hashHandlerInstance.validatePassword({ repeatedPassword,password })

        const hashedPassword = await hashHandlerInstance.hashPassword(password)
        
        const createdTeacher = await this.repository.$save({ name, email, password: hashedPassword })
        
        return createdTeacher;
    }
    
    async updateTeacher({ name, email, active, id }) {
        const currentTeacher = await this.findById({ id })

        currentTeacher.name = name || currentTeacher.name
        currentTeacher.email = email || currentTeacher.email
        currentTeacher.active = active || currentTeacher.active

        const updatedTeacher = await this.repository.$update(currentTeacher)
        
        return updatedTeacher;
    }

    async getTeacherByEmail({ email }) {
        const teacher = await this.repository.$findOne({ email });

        if (!teacher)
            throw new NotFoundException("Nenhum professor encontrado para o email informado", { email })

        return teacher
    }
}

module.exports = TeacherService
