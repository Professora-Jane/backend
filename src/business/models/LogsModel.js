const { Schema, Types } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../lib/DateAndTimeUtil")

const LogsModel = new Schema({
    who: {
        type: Types.ObjectId,
        required: true,
    },
    involved: [{
        type: Types.ObjectId
    }],
    action : {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete', 'other']
    },
    model: {
        type: String,
        required: true,
    },
    humanReadableMessage: {
        type: String,
        required: true
    },
    payload: {
        type: Object,
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
    collection: 'logs',
    toJSON: {
        getters: true
    }
});

LogsModel.virtual("id").get(function() {
    return this._id.toHexString();
})


module.exports = dbInstance.getCollection("Logs", LogsModel);