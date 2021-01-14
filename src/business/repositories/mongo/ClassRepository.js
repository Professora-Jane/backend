const ClassModel = require("../../models/ClassModel");
const BaseRepository = require("./BaseRepository");
const mongoose = require("mongoose");

class ClassRepository extends BaseRepository {
    constructor() {
        super(ClassModel)
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
            teacherId = mongoose.Types.ObjectId(teacherId);

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
            teacherId = mongoose.Types.ObjectId(teacherId);
        if (typeof discipline === "string") 
            discipline = mongoose.Types.ObjectId(discipline);

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
            teacherId = mongoose.Types.ObjectId(teacherId);
        if (typeof studentId === "string") 
            studentId = mongoose.Types.ObjectId(studentId);

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

module.exports = ClassRepository
