const BaseRepository = require("./BaseRepository");
const StudentModel = require("../models/StudentModel");

class StudentRepository extends BaseRepository {
    constructor() {
        super(StudentModel)
    }
}

module.exports = StudentRepository
