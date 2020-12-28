const { Schema, Types } = require('mongoose');
const { dbInstance } = require("../../db");
const DateAndTimeUtils = require('../lib/DateAndTimeUtil');
const DateUtil = require("../lib/DateAndTimeUtil")

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
    startTime: {
        type: Number,
        required: true,
        get: (val) => DateAndTimeUtils.convertMinutesToHours(val)
    },
    endTime: {
        type: Number,
        required: true,
        get: (val) => DateAndTimeUtils.convertMinutesToHours(val)
    },
    daysOfWeek: [{
        type: Number,
        enum: [0,1,2,3,4,5,6],
        required: true
    }],
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
}, { 
    collection: 'teacher_student',
    toJSON: { getters: true },
    toObject: { getters: true }
});

module.exports = dbInstance.getCollection("TeacherStudentClass", TeacherStudentClassModel);