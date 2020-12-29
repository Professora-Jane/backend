const BaseRepository = require("./BaseRepository");
const StudentModel = require("../models/StudentModel");
const { Types } = require("mongoose");

class StudentRepository extends BaseRepository {
    constructor() {
        super(StudentModel)
    }

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
}

module.exports = StudentRepository
