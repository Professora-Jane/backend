const { Schema } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../utils/DateAndTimeUtil")

const DisciplineModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
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
    collection: 'discipline',
    toJSON: {
        getters: true
    }
});

DisciplineModel.virtual("id").get(function() {
    return this._id.toHexString();
})


module.exports = dbInstance.getCollection("Discipline", DisciplineModel);