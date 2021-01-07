const { tz } = require("moment-timezone");
const DateAndTimeUtils = require("../lib/DateAndTimeUtil");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const TeacherRepository = require("../repositories/TeacherRepository");
const BaseService = require("./BaseService");
const InvalidParamsException = require("../lib/httpExceptions/InvalidParamsException");
const { hashHandlerInstance } = require("../lib/auth/HashHandler");


class TeacherService extends BaseService {

    constructor() {
        super()
        this.repository = new TeacherRepository();
    }


    async createTeacher({ name, email, password, repeatedPassword }) {
        this.#validatePassword({ repeatedPassword,password })

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

    async listTeacherClass({ teacherId, studentId }) {
        const classList = await this.repository.listTeacherClasses({ teacherId, studentId });

        if (!classList)
            throw new NotFoundException("Nenhuma classe encontrada para o professor informado", { teacherId })
        
        const classesWithTime = classList.map(item => {

            item.startTime = DateAndTimeUtils.getTimestampFromMinutesAndDayIndex(item.startTime, item.daysOfWeek)
            item.endTime = DateAndTimeUtils.getTimestampFromMinutesAndDayIndex(item.endTime, item.daysOfWeek)

            return item
        })

        return classesWithTime;
    }

    #validatePassword({ password, repeatedPassword }) {
        if (password !== repeatedPassword)
            throw new InvalidParamsException("As senhas informadas não são iguais")
        
        if (password.length < 8) 
        throw new InvalidParamsException("A senha deve ter no mínimo 8 caracteres")
    }
}

module.exports = TeacherService
