const { Types } = require("mongoose");
const ConflictException = require("../lib/httpExceptions/ConflictException");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const TeacherStudentRepository = require("../repositories/mongo/TeacherStudentRepository");
const BaseService = require("./BaseService");
const ClassService = require("./ClassService");
const StudentService = require("./StudentService");
const TeacherService = require("./TeacherService");

class TeacherStudentService extends BaseService {
    constructor() {
        super()
        this.repository = new TeacherStudentRepository();
        this.studentService = new StudentService();
        this.teacherService = new TeacherService();
        this.classService = new ClassService();
    }

    async create({ teacherId, studentEmail = undefined, studentId = undefined }) {

        let student = undefined;

        await this.teacherService.findById({ id: teacherId });

        if (studentEmail) {
            student = await this.studentService.getStudentByEmail({ email: studentEmail });
        }
        else {
            student = await this.studentService.findById({ id: studentId });
        }

        const teacherStudent = await this.repository.$findOne({ teacherId, studentId: student._id });

        if (teacherStudent)
            throw new ConflictException("O aluno especificado já está cadastrado para o professor informado", { studentId: student._id, teacherId })


        const createdTeacherStudent = await this.repository.$save({ teacherId, studentId: student._id });

        return createdTeacherStudent;
    }

    async getTeacherStudent({ teacherId, studentId }) {

        teacherId = this.repository.convertToObjectId(teacherId)
        studentId = this.repository.convertToObjectId(studentId)
        
        const teacherStudent = await this.repository.$findOne({ teacherId, studentId })

        if (!teacherStudent)
            throw new NotFoundException("TeacherStudent não encontrado para os dados informados", { teacherId, studentId });

        return teacherStudent
    }


    async deleteTeacherStudent({ teacherId, studentId }) {

        // Encontrar teacherStudent
        const teacherStudent = await this.getTeacherStudent({ studentId, teacherId });

        const response = await this.executeTransaction(async (session) => {
            // Encontrar todas as classes
            const classes = await this.teacherService.repository.listTeacherClasses({ studentId, teacherId }, session)

            if (classes) {
                // remover todas as classes
                const deleteClassesSuccess = await this.classService.repository.deleteStudentClasses({
                    teacherId,
                    studentId,
                    idList: classes.map(item => item.id)
                }, session)

                if (!deleteClassesSuccess)
                    throw new Error("Erro ao deletar classes do estudante")
            }
            
            // Remover o teacherStudent
            const deleteTeacherStudentSuccess = await this.repository.deleteTeacherStudent({ teacherStudent }, session)

            if (!deleteTeacherStudentSuccess)
                throw new Error("Erro ao deletar estudante do professor")

            return true
        });

        return response;
    }
    
}

module.exports = TeacherStudentService
