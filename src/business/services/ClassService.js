const BaseService = require("./BaseService");
const StudentService = require("./StudentService");
const TeacherService = require("./TeacherService");
const DateAndTimeUtils = require("../utils/DateAndTimeUtil");
const InvalidParamsException = require("../lib/httpExceptions/InvalidParamsException");
const DisciplineService = require("./DisciplineService");
const ClassRepository = require("../repositories/mongo/ClassRepository");
const ConflictException = require("../lib/httpExceptions/ConflictException");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");

class ClassService extends BaseService {
    constructor() {
        super()
        this.repository = new ClassRepository();
        this.studentService = new StudentService();
        this.teacherService = new TeacherService();
        this.disciplineService = new DisciplineService();
    }

    async create({ studentId, teacherId, startTime, endTime, daysOfWeek, discipline }) {
        
        this.#validateClassSchedule({ startTime, endTime, daysOfWeek });
        await this.#validateOthersClassesByScheduleAndDiscipline({ startTime, teacherId, endTime, discipline, daysOfWeek, studentId });

        startTime = DateAndTimeUtils.convertHourToMinutes(startTime)
        endTime = DateAndTimeUtils.convertHourToMinutes(endTime)

        await this.studentService.findById({ id: studentId});
        await this.teacherService.findById({ id: teacherId });
        await this.disciplineService.findById({ id: discipline });

        const result = await this.repository.$save({
            studentId,
            teacherId,
            startTime,
            endTime,
            daysOfWeek,
            discipline
        })

        return result;
    }

    /**
     * @description Função responsável por validar a inserção de uma nova classe baseada em classes já existentes. Algumas regras 
     * devem ser obedecidas: uma aula não pode sobrepor outra se os horários não forem idênticos, e caso sejam devem necessariamente ser 
     * da mesma disciplina.
     * 
     * @param { object } params 
     * @param { string } params.startTime - Tempo de início da aula 
     * @param { string } params.endTime - Tempo de fim da aula 
     * @param { string } params.teacherId - Id do professor
     * @param { string } params.discipline - Id da disciplina que será ministrada
     * @param { Array<string|number> } params.daysOfWeek - Array de dias da semana os quais serão ministrados a disciplina
     * 
     * @throws { ConflictException } 
     * @returns { Promise<true> }
     */
    async #validateOthersClassesByScheduleAndDiscipline({ startTime, teacherId, endTime, discipline, daysOfWeek, studentId }) {
        const actuallyExists = await this.repository.checkIfClassExists({
            time: DateAndTimeUtils.convertHourToMinutes(startTime),
            teacherId,
            daysOfWeek,
            studentId
        })

        if (actuallyExists)
            throw new ConflictException(
                "A classe informada já existe ou conflita com uma já existente para o aluno informado", 
                { startTime, endTime, daysOfWeek, studentId }
            )

        const initValidation = await this.repository.checkIfTimeConflictsWithOtherClasses({ 
            time: DateAndTimeUtils.convertHourToMinutes(startTime), 
            teacherId, 
            daysOfWeek
        });
        
        const endValidation = await this.repository.checkIfTimeConflictsWithOtherClasses({ 
            time: DateAndTimeUtils.convertHourToMinutes(endTime),
            teacherId,
            daysOfWeek
        });

        if ( initValidation || endValidation ) 
            throw new ConflictException("Já existem classes sobrepostas no horário informado", { startTime, endTime, daysOfWeek })

        const classesWithDifferentDisciplines = await this.repository.checkIfConflictsWithOtherClassesWithDiferentDiscipline({
            time: DateAndTimeUtils.convertHourToMinutes(startTime),
            teacherId,
            daysOfWeek,
            discipline
        })

        if (classesWithDifferentDisciplines)
            throw new ConflictException(
                "Já existe uma matéria nesse horário com outra disciplina. Escolha outro horário ou crie uma nova classe com a mesma disciplina anterior",
                { startTime, teacherId, endTime, discipline, daysOfWeek }
            )
        

        return true
    }

    #validateClassSchedule({ startTime, endTime }) {
        const comparedHours = DateAndTimeUtils.compareHours(startTime, endTime);

        if (DateAndTimeUtils.convertHourToMinutes(startTime) > 1439 ||
            DateAndTimeUtils.convertHourToMinutes(endTime) > 1439) {
            throw new InvalidParamsException("A hora não pode ser superior à 23:59!!", { startTime, endTime })
        }

        if (comparedHours <= 0)
            throw new InvalidParamsException("A hora de início deve ser menor que a hora de fim!", { startTime, endTime })
        
        return true
    }

    /**
     * 
     * @param { object } params 
     * @param { string } params.studentId - Id do estudante
     * @param { string } params.teacherId - Id do professor 
     */
    async getStudentClasses({ studentId, teacherId }) {
        
        const result = await this.#listClasses({
            ids: { studentId, ...(teacherId && { teacherId })},
            matchIdKey: "studentId",
            ...(teacherId && {restrictionIdKey: "teacherId"}),
            errorContent: {
                message: "Nenhuma classe encontrada para o aluno informado",
                payload: {
                    studentId, teacherId
                }
            }
        })

        return result;
    }
    
    /**
     * 
     * @param { object } params 
     * @param { string } params.studentId - Id do estudante
     * @param { string } params.teacherId - Id do professor 
     */
    async listTeacherClasses({ studentId, teacherId }) {
        
        const result = await this.#listClasses({
            ids: { teacherId, ...(studentId && { studentId })},
            matchIdKey: "teacherId",
            ...(studentId && {restrictionIdKey: "studentId"}),
            errorContent: {
                message: "Nenhuma classe encontrada para o aluno informado",
                payload: {
                    studentId, teacherId
                }
            }
        })

        return result;
    }

    async #listClasses({ ids, matchIdKey, restrictionIdKey = undefined, errorContent }) {
        const result = await this.repository.getClasses({ ids, matchIdKey, restrictionIdKey });

        if (!result.length)
            throw new NotFoundException(errorContent.message, errorContent.payload )

        const classesWithTime = result.map(item => {

            item.startTime = DateAndTimeUtils.getTimestampFromMinutesAndDayIndex(item.startTime, item.daysOfWeek)
            item.endTime = DateAndTimeUtils.getTimestampFromMinutesAndDayIndex(item.endTime, item.daysOfWeek)

            return item
        })

        return classesWithTime
    }
}

module.exports = ClassService
