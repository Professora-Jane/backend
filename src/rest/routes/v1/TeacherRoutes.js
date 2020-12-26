const TeacherController = require("../../controllers/TeacherController");
const  createTeacherSchema = require("../../schemas/createTeacherSchema");
const idSchema = require("../../schemas/IdSchema");
const NotFoundException = require("../../../business/lib/httpExceptions/NotFoundException");

const teacherController = new TeacherController();

module.exports = (app, opts, done) => {
    app.get('/:id', { schema: idSchema }, async (req, res) => await teacherController.getTeacher(req, res));

    app.get('/', { schema: idSchema }, async (req, res) =>  {throw new NotFoundException("Teste")});

    app.post('/teacher', { schema: createTeacherSchema }, async (req, res) => await teacherController.createTeacher(req, res));

    done()
}