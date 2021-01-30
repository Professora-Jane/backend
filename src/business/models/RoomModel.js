const { Schema } = require('mongoose');
const { Types } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../utils/DateAndTimeUtil")

const RoomModel = new Schema({
    admin: {
        type: Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [ "criado", "andamento", "finalizado" ]
    },
    active: {
        type: Boolean,
        required: true,
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
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
    collection: 'room',
    toJSON: {
        getters: true
    }
});

RoomModel.virtual("id").get(function() {
    return this._id.toHexString();
})


module.exports = dbInstance.getCollection("Room", RoomModel);