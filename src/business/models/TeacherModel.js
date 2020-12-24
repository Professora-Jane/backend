const { Schema } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../lib/DateUtil")

const TeacherModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
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
}, { collection: 'teacher' });

module.exports = dbInstance.getCollection("Teacher", TeacherModel);