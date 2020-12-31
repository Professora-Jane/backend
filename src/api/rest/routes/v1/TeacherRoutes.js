const TeacherController = require("../../controllers/TeacherController");
const createTeacherSchema = require("../../schemas/createTeacherSchema");
const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const idSchema = require("../../schemas/requests/IdSchemaRequest");
const teacherController = new TeacherController();


module.exports = (app, opts, done) => {
    app.get(
        '/teacher/:id', 
        { 
            schema: {
                tags: ['Teacher'],
                params: idSchema.params
            } 
        }, 
        async (req, res) => await teacherController.getTeacher(req, res)
    );
    
    app.get(
        '/teacher/list/classes/:id', 
        { 
            schema: {
                tags: ['Teacher'],
                params: idSchema.params,
                query: {
                    studentId: { 
                        type: 'string',
                        minLength: 24,
                        maxLength: 24
                    },
                }
            } 
        }, 
        async (req, res) => await teacherController.listTeacherClasses(req, res)
    );

    app.post(
        '/teacher', 
        { 
            schema: { 
                tags: ['Teacher'],
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
                tags: ['Teacher'],
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

    app.put(
        '/teacher/:id',
        {
            schema: {
                tags: ['Teacher'],
                params: idSchema.params
            }
        },
        async (req, res) => await teacherController.updateTeacher(req, res)
    );
    
    done()
}