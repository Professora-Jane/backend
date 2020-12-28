const BaseService = require("./BaseService");
const StudentService = require("./StudentService");
const TeacherService = require("./TeacherService");
const DateAndTimeUtils = require("../lib/DateAndTimeUtil");
const InvalidParamsException = require("../lib/httpExceptions/InvalidParamsException");
const DisciplineService = require("./DisciplineService");
const ClassRepository = require("../repositories/ClassRepository");
const ConflictException = require("../lib/httpExceptions/ConflictException");

class ClassService extends BaseService {
    constructor() {
        super(ClassRepository)
        this.studentService = new StudentService();
        this.teacherService = new TeacherService();
        this.disciplineService = new DisciplineService();
    }

    async create({ 
        studentId,
        teacherId,
        startTime,
        endTime,
        daysOfWeek,
        discipline
    }) {
        this.#validateClassSchedule({ startTime, endTime, daysOfWeek });
        await this.#validateOthersClassesByScheduleAndDiscipline({ startTime, teacherId, endTime, discipline, daysOfWeek });

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
     * @param { Array<string> } params.daysOfWeek - Array de dias da semana os quais serão ministrados a disciplina
     * 
     * @throws { ConflictException } 
     * @returns { true }
     */
    async #validateOthersClassesByScheduleAndDiscipline({ startTime, teacherId, endTime, discipline, daysOfWeek }) {
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
}

module.exports = ClassService
