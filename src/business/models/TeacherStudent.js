const { Schema, Types } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../lib/DateUtil")

const TeacherStudentClassModel = new Schema({
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
    classSchedule: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    discipline: {
        type: Types.ObjectId,
        ref: 'Discipline',
        required: true,
    },
    active: {
        default: true,
        type: Boolean,
    },
    creationDate: {
        type: Date,
        default: () => DateUtil.getDateWithTz()

    },
    lastUpdateDate: {
        type: Date,
        default: () => DateUtil.getDateWithTz()
    }
}, { collection: 'teacher_student' });

module.exports = dbInstance.getCollection("TeacherStudentClass", TeacherStudentClassModel);