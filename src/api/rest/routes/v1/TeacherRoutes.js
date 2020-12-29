const TeacherController = require("../../controllers/TeacherController");
const createTeacherSchema = require("../../schemas/createTeacherSchema");
const IdResponseSchema = require("../../schemas/IdResponseSchema");
const idSchema = require("../../schemas/IdSchema");
const teacherController = new TeacherController();


module.exports = (app, opts, done) => {
    app.get('/teacher/:id', { schema: idSchema }, async (req, res) => await teacherController.getTeacher(req, res));

    app.post(
        '/teacher', 
        { 
            schema: { 
                body: createTeacherSchema.body, 
                response: IdResponseSchema.response 
            }
        },
        async (req, res) => await teacherController.createTeacher(req, res)
    );

    app.post(
        '/teacher/student', 
        { 
            schema: { 
                body: {
                    type: 'object',
                    required: ['teacherId'],
                    properties: {
                        studentId: { 
                            type: 'string',
                            minLength: 24,
                            maxLength: 24
                        },
                        teacherId: { 
                            type: 'string',
                            minLength: 24,
                            maxLength: 24
                        },
                        studentEmail: {
                            type: 'string'
                        }
                    }
                }, 
                response: IdResponseSchema.response 
            }
        },
        async (req, res) => await teacherController.createTeacherStudent(req, res)
    );

    app.put('/teacher/:id', async (req, res) => await teacherController.updateTeacher(req, res));
    
    done()
}