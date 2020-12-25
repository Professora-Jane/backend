const { Schema } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../lib/DateUtil")

const ResponsibleModel = new Schema({
    studentId: {
        type: Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cellPhone: {
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
}, { collection: 'responsible' });

module.exports = dbInstance.getCollection("Responsible", ResponsibleModel);