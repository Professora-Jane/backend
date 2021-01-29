const { Types } = require("mongoose");
const TeacherModel = require("../../models/TeacherModel");
const BaseRepository = require("./BaseRepository");

class TeacherRepository extends BaseRepository {
    constructor() {
        super(TeacherModel)
    }
}

/**
 * @typedef { object } Teacher
 * @property { string } name - Nome do professor
 * @property { string } email - Email do professor
 * @property { string } password - Senha hasheada do professor
 * @property { boolean } active - Se está ativo ou não
 * @property { Date } creationDate - Data de criação do document
 * @property { Date } lastUpdateDate - Data de última atualização do document
 */
module.exports = TeacherRepository
