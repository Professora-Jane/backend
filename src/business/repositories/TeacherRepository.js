const { Types } = require("mongoose");
const TeacherModel = require("../models/TeacherModel");
const BaseRepository = require("./BaseRepository");

class TeacherRepository extends BaseRepository {
    constructor() {
        super(TeacherModel)
    }

    /**
     * 
     * @param { object } params
     * @param { string } params.teacherId - Id do professor
     * @param { string } [params.studentId = undefined] - Id do aluno 
     *
     * @returns { Promise<Array<ClassList>> }  O processo
     *  
     */
    async listTeacherClasses({ teacherId, studentId = undefined }, session ) {
        if (typeof teacherId === "string")
            teacherId = Types.ObjectId(teacherId)
        if (studentId && typeof studentId === "string")
            studentId = Types.ObjectId(studentId)

        const classes = await this.$listAggregate([
            {
                '$match': {
                    '_id': teacherId
                }
            }, {
                '$lookup': {
                    'from': 'class', 
                    'localField': '_id', 
                    'foreignField': 'teacherId', 
                    'as': 'classes'
                }
            }, {
                '$unwind': {
                    'path': '$classes', 
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$classes'
                }
            }, {
                '$unwind': {
                    'path': '$daysOfWeek', 
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$lookup': {
                    'from': 'student', 
                    'localField': 'studentId', 
                    'foreignField': '_id', 
                    'as': 'student'
                }
            }, {
                '$lookup': {
                    'from': 'discipline', 
                    'localField': 'discipline', 
                    'foreignField': '_id', 
                    'as': 'discipline'
                }
            }, {
                '$unwind': {
                    'path': '$discipline', 
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$unwind': {
                    'path': '$student', 
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$addFields': {
                    'discipline': '$discipline.name', 
                    'name': {
                        '$concat': [
                            '$student.name', ' - ', '$discipline.name'
                        ]
                    },
                    'id': {
                        '$toString':'$_id'
                    }
                }
            }, {
                '$project': {
                    'student': 0
                }
            },
            ...(studentId?  [{
                '$match': {
                    'studentId': studentId
                }
            }] : [])
        ], session)

        let result = false

        if (classes.length)
            result = classes

        return result;
    }
}

/**
 * @typedef {Object} ClassList
 * @property {string} id - O id do processo
 * @property {boolean} active - se ativo ou não
 * @property {number} daysOfWeek - Inteiro representando o dia de semana
 * @property {string} studentId - Id do estudante 
 * @property {string} teacherId - Id do professor 
 * @property {number} startTime - Tempo, em minutos, de início da aula 
 * @property {number} endTime - Tempo, em minutos, do final da aula 
 * @property {string} discipline - Nome da disciplina
 * @property {string} studentName - Nome do estudante
 * @property {Date} creationDate - Data de criação do processStep
 * @property {Date} lastUpdateDate - Data de última atualização do processStep
 */
module.exports = TeacherRepository