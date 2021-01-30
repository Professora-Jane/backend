const { Schema } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../utils/DateAndTimeUtil")

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
    collection: 'responsible',
    toJSON: {
        getters: true
    }
});

ResponsibleModel.virtual("id").get(function() {
    return this._id.toHexString();
})


module.exports = dbInstance.getCollection("Responsible", ResponsibleModel);