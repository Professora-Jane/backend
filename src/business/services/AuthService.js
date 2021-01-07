const { authHandlerInstance } = require("../lib/auth/AuthHandler");
const { hashHandlerInstance } = require("../lib/auth/HashHandler");
const InvalidParamsException = require("../lib/httpExceptions/InvalidParamsException");
const StudentService = require("./StudentService");
const TeacherService = require("./TeacherService")

class AuthService {
    constructor() {
        this.teacherService = new TeacherService();
        this.studentService = new StudentService();
    }

    async authenticateUser({ id, type, password }) {
        const user = await this.getUser({ id, type })

        await this.validateUserPassword({ user, password })

        const token = authHandlerInstance.sign({
            email: user.email,
            name: user.name,
            id,
            type
        })

        const clientData = {
            id,
            token
        }

        return clientData
    }

    async validateUserPassword({ user, password }) {
        const result = await hashHandlerInstance.comparePassword(password, user.password)

        if (!result)
            throw new InvalidParamsException("Credenciais inválidas!!");

        return result
    }

    async validateUserToken({ token }) {
        const decodedToken = authHandlerInstance.verify(token)

        // TODO manter em cache usando redis
        const user = await this.getUser({ type: decodedToken.type, id: decodedToken.id })
        
        user.type = decodedToken.type

        return user;
    }

    async getUser({ type, id }) {
        let user;

        if (type === "professor")
            user = await this.teacherService.findById({ id });
        else if (type === "aluno ")
            user = await this.studentService.findById({ id });
        
        return user
    }
}

module.exports = AuthService