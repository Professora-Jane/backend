const { Schema } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../lib/DateAndTimeUtil")

const StudentModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
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
}, { 
    collection: 'student',
    toJSON: {
        getters: true,
    }
});

StudentModel.virtual("id").get(function() {
    return this._id.toHexString();
})

module.exports = dbInstance.getCollection("Student", StudentModel);