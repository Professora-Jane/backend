const TeacherController = require("../../controllers/TeacherController");

const teacherController = new TeacherController();

module.exports = (fastify, opts, done) => {
    fastify.get('/', async (req, res) => await teacherController.getTeacher(req, res))

    done()
}