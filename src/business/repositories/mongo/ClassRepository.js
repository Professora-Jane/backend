const ClassModel = require("../../models/ClassModel");
const BaseRepository = require("./BaseRepository");
const { Types } = require("mongoose");

class ClassRepository extends BaseRepository {
    constructor() {
        super(ClassModel)
    }

    /**
     * 
     * @param { object } ids - Objeto de ids
     * @returns { Promise<Array<ClassList>> }
     */
    async getClasses({ ids, matchIdKey, restrictionIdKey = undefined }) {

        for (let id in ids) {
            if (typeof id === "string")
            ids[id] = Types.ObjectId(ids[id])
        }

        const reverseKey = matchIdKey === "teacherId"? "student" : "teacher"

        const response = await this.$listAggregate([
            {
                '$match': {
                    [matchIdKey]: ids[matchIdKey]
                }
            }, {
                '$unwind': {
                    'path': '$daysOfWeek', 
                    'preserveNullAndEmptyArrays': false
                }
            }, {
                '$lookup': {
                    'from': 'teacher', 
                    'localField': 'teacherId', 
                    'foreignField': '_id', 
                    'as': 'teacher'
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
                    'path': '$teacher', 
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
                            `$${reverseKey}.name`, ' - ', '$discipline.name'
                        ]
                    }, 
                    'id': {
                        '$toString': '$_id'
                    }
                }
            }, {
                '$project': {
                    'discipline': 0, 
                    'teacher': 0,
                    'student': 0
                }
            },
            ...(restrictionIdKey?  [{
                '$match': {
                    [restrictionIdKey]: ids[restrictionIdKey]
                }
            }] : [])
        ])

        return response
    }

    async deleteStudentClasses({ teacherId, studentId, idList }, session) {
        const query = { _id: { '$in': idList.map(this.convertToObjectId) } }
        
        /**
         * @type { import("./BaseRepository").logDataModel }
         */
        const logData = {
            action: 'delete',
            humanReadableMessage: "Removeu dados do estudante",
            involved: [ this.convertToObjectId(studentId) ],
            who: this.convertToObjectId(teacherId),
            payload: {query: JSON.stringify(query)}
        }

        const result = await this.$deleteMany({ query, logData }, session);

        return result;
    }

    /**
     * 
     * @param {*} param0
     * @returns { Promise<boolean> } 
     */
    async checkIfTimeConflictsWithOtherClasses({ teacherId, time, daysOfWeek }) {
        if (typeof teacherId === "string") 
            teacherId = Types.ObjectId(teacherId);

        const result = await this.$listAggregate([
            {
                '$match': {
                    'teacherId': teacherId, 
                    'startTime': {
                        '$lt': time
                    }, 
                    'endTime': {
                        '$gt': time
                    },
                    'daysOfWeek': {
                        '$in': daysOfWeek
                    }
                }
              }, {
                '$count': 'id'
              }
        ])

        return result[0]?.id > 0
    }

    /**
     * 
     * @param {*} param0s
     * @returns { Promise<boolean> } 
     */
    async checkIfConflictsWithOtherClassesWithDiferentDiscipline({ teacherId, time, daysOfWeek, discipline }) {
        if (typeof teacherId === "string") 
            teacherId = Types.ObjectId(teacherId);
        if (typeof discipline === "string") 
            discipline = Types.ObjectId(discipline);

        const result = await this.$listAggregate([
            {
                '$match': {
                    'teacherId': teacherId, 
                    'startTime': {
                        '$eq': time
                    }, 
                    'daysOfWeek': {
                        '$in': daysOfWeek
                    }, 
                    'discipline': {
                        '$ne': discipline
                    }
                }
            }, {
                '$count': 'id'
            }
        ])

        return result[0]?.id > 0
    }

    /**
     * 
     * @param {*} param0
     * @returns { Promise<boolean> } 
     */
    async checkIfClassExists({ teacherId, time, daysOfWeek, studentId }) {
        if (typeof teacherId === "string") 
            teacherId = Types.ObjectId(teacherId);
        if (typeof studentId === "string") 
            studentId = Types.ObjectId(studentId);

        const result = await this.$listAggregate([
            {
                '$match': {
                    'teacherId': teacherId, 
                    'studentId': studentId,
                    'startTime': {
                        '$eq': time
                    }, 
                    'daysOfWeek': {
                        '$in': daysOfWeek
                    },
                }
            }, {
                '$count': 'id'
            }
        ])

        return result[0]?.id > 0
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
module.exports = ClassRepository
