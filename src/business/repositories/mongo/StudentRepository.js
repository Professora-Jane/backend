const BaseRepository = require("./BaseRepository");
const StudentModel = require("../../models/StudentModel");
const { Types } = require("mongoose");

class StudentRepository extends BaseRepository {
    constructor() {
        super(StudentModel)
    }


    /**
     * 
     * @param {*} param0
     * @returns {Promise<import("./BaseRepository").paginatedResponse<Student>>}  
     */
    async listStudentsByTeacherId({ page, limit, search, teacherId }) {
        if (typeof teacherId === "string")
            teacherId = Types.ObjectId(teacherId);
        
        const searchKeys = ["name", "email"]
        
        const pipeline = [
            {
                '$lookup': {
                    'from': 'teacher_student', 
                    'localField': '_id', 
                    'foreignField': 'studentId', 
                    'as': 'teacher_student'
                }
            }, {
                '$unwind': {
                    'path': '$teacher_student', 
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$match': {
                    'teacher_student.teacherId': teacherId
                }
            }, {
                '$project': {
                    'teacher_student': 0,
                }
            }, {
                '$addFields': {
                    'id': {
                        '$toString':'$_id'
                    }
                }
            }
        ]

        const response = await this.$paginate({ page, limit, search, searchFields: searchKeys, pipeline })

        return response;
    }


    /**
     * 
     * @param {*} param0
     * @returns {Promise<import("./BaseRepository").paginatedResponse<import("./TeacherRepository").Teacher>>} 
     */
    async listTeachers({ page, limit, search, studentId }) {
        if (typeof studentId === "string")
            studentId = Types.ObjectId(studentId);
        
        const searchKeys = [ "name", "email", "cellPhone" ]
        
        const pipeline = [
            {
                '$match': {
                    '_id': studentId
                }
            }, {
                '$lookup': {
                    'from': 'teacher_student', 
                    'localField': '_id', 
                    'foreignField': 'studentId', 
                    'as': 'teacher_student'
                }
            }, {
                '$lookup': {
                    'from': 'teacher', 
                    'localField': 'teacher_student.teacherId', 
                    'foreignField': '_id', 
                    'as': 'teachers'
                }
            }, {
                '$unwind': {
                    'path': '$teachers', 
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$teachers'
                }
            }, {
                '$project': {
                    'password': 0
                }
            }
        ]

        const response = await this.$paginate({ page, limit, search, searchFields: searchKeys, pipeline, autoPopulateId: true })

        return response;
    }
}

/**
 * @typedef { object } Student
 * @property { string } name - Nome do estudante
 * @property { string } email - Email do aluno
 * @property { string } cellPhone - Celular do aluno
 * @property { string } password - Senha hasheada do aluno
 * @property { boolean } active - Se está ativo ou não
 * @property { Date } creationDate - Data de criação do document
 * @property { Date } lastUpdateDate - Data de última atualização do document
 */
module.exports = StudentRepository
