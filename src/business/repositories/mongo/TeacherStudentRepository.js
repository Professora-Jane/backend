const TeacherStudentModel = require("../../models/TeacherStudentModel");
const BaseRepository = require("./BaseRepository");

class TeacherStudentRepository extends BaseRepository {
    constructor() {
        super(TeacherStudentModel)
    }

    async deleteTeacherStudent({ teacherStudent }, session) {
        const query = { _id: teacherStudent._id }
        
        /**
         * @type { import("./BaseRepository").logDataModel }
         */
        const logData = {
            action: 'delete',
            humanReadableMessage: "Removeu o estudante",
            involved: [ teacherStudent.studentId ],
            who: teacherStudent._id,
            payload: query
        }

        const result = await this.$deleteMany({ query, logData }, session);

        return result;
    }
}

module.exports = TeacherStudentRepository
