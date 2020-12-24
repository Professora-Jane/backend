const TeacherModel = require("../models/TeacherModel");
const BaseRepository = require("./BaseRepository");

class TeacherRepository extends BaseRepository {
    constructor() {
        super(TeacherModel)
    }
}

module.exports = TeacherRepository