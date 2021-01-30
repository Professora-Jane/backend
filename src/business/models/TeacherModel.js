const { Schema } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../utils/DateAndTimeUtil")

const TeacherModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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
    collection: 'teacher',
    toJSON: {
        getters: true
    }
});

TeacherModel.virtual("id").get(function() {
    return this._id.toHexString();
})

module.exports = dbInstance.getCollection("Teacher", TeacherModel);