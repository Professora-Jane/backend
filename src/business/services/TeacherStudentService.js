const { Types } = require("mongoose");
const ConflictException = require("../lib/httpExceptions/ConflictException");
const NotFoundException = require("../lib/httpExceptions/NotFoundException");
const TeacherStudentRepository = require("../repositories/TeacherStudentRepository");
const BaseService = require("./BaseService");
const StudentService = require("./StudentService");
const TeacherService = require("./TeacherService");

class TeacherStudentService extends BaseService {
    constructor() {
        super(TeacherStudentRepository)
        this.studentService = new StudentService();
        this.teacherService = new TeacherService();
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
        if (typeof teacherId === "string")
            teacherId = Types.ObjectId(teacherId)
        if (typeof studentId === "string")
            studentId = Types.ObjectId(studentId)
        
        const teacherStudent = await this.repository.$findOne({ teacherId, studentId })

        if (!teacherStudent)
            throw new NotFoundException("TeacherStudent não encontrado para os dados informados", { teacherId, studentId });

        return teacherStudent
    }

    
}

module.exports = TeacherStudentService
