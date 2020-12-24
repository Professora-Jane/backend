const TeacherController = require("../../controllers/TeacherController");
const  createTeacherSchema = require("../../schemas/createTeacherSchema");

const teacherController = new TeacherController();

module.exports = (app, opts, done) => {
    app.get('/', async (req, res) => await teacherController.getTeacher(req, res));

    app.post('/teacher', { schema: createTeacherSchema }, async (req, res) => await teacherController.createTeacher(req, res));

    done()
}