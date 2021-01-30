const { Schema, Types } = require('mongoose');
const { dbInstance } = require("../../db");
const DateAndTimeUtils = require('../utils/DateAndTimeUtil');

const ClassModel = new Schema({
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
        default: () => DateAndTimeUtils.getDateWithTz()

    },
    lastUpdateDate: {
        type: Date,
        default: () => DateAndTimeUtils.getDateWithTz()
    }
}, { 
    collection: 'class',
    toJSON: { 
        getters: true
    },
    toObject: { getters: true }
});

ClassModel.virtual("id").get(function() {
    return this._id.toHexString();
})


module.exports = dbInstance.getCollection("TeacherStudentClass", ClassModel);