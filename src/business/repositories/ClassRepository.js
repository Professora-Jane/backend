const ClassModel = require("../models/ClassModel");
const BaseRepository = require("./BaseRepository");
const mongoose = require("mongoose");

class ClassRepository extends BaseRepository {
    constructor() {
        super(ClassModel)
    }

    /**
     * 
     * @param {*} param0
     * @returns { boolean } 
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
     * @param {*} param0
     * @returns { boolean } 
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
}

module.exports = ClassRepository
