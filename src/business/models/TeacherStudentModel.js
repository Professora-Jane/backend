const { Schema } = require('mongoose');
const { Types } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../lib/DateAndTimeUtil")

const TeacherStudentModel = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    teacherId: {
        type: Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    creationDate: {
        type: Date,
        default: () => DateUtil.getDateWithTz()
    },
    lastUpdateDate: {
        type: Date,
        default: () => DateUtil.getDateWithTz()
    }
}, { 
    collection: 'teacher_student',
    toJSON: {
        getters: true
    }
});

TeacherStudentModel.virtual("id").get(function() {
    return this._id.toHexString();
})


module.exports = dbInstance.getCollection("TeacherStudent", TeacherStudentModel);