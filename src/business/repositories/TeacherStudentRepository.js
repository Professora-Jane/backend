const TeacherStudentModel = require("../models/TeacherStudentModel");
const BaseRepository = require("./BaseRepository");

class TeacherStudentRepository extends BaseRepository {
    constructor() {
        super(TeacherStudentModel)
    }
}

module.exports = TeacherStudentRepository
