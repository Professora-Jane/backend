const { Schema } = require('mongoose');
const { dbInstance } = require("../../db")
const DateUtil = require("../lib/DateUtil")

const DisciplineModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    domainId: {
        type: Number,
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
}, { collection: 'discipline' });

module.exports = dbInstance.getCollection("Discipline", DisciplineModel);