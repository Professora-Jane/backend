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

    async authenticateUser({ email, id, type, password }) {
        const user = await this.getUser({ id, type, email })

        await this.validateUserPassword({ user, password })

        const token = authHandlerInstance.sign({
            email: user.email,
            name: user.name,
            id,
            type
        })

        const clientData = {
            id: user.id,
            token,
            name: user.name
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
        const user = await this.getUser({ type: decodedToken.type, id: decodedToken.id, email: decodedToken.email })
        
        user.type = decodedToken.type

        return user;
    }

    async getUser({ type, id, email }) {
        let user;

        if (email) {
            if (type === "professor")
                user = await this.teacherService.getTeacherByEmail({ email });
            else if (type === "aluno")
                user = await this.studentService.getStudentByEmail({ email });
        }
        else if (id) {
            if (type === "professor")
                user = await this.teacherService.findById({ id });
            else if (type === "aluno")
                user = await this.studentService.findById({ id });
        }
        
        return user
    }
}

module.exports = AuthService