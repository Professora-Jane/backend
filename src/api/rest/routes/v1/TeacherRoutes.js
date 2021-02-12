const TeacherController = require("../../controllers/TeacherController");
const createTeacherSchema = require("../../schemas/createTeacherSchema");
const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const idSchema = require("../../schemas/requests/IdSchemaRequest");
const fastify = require('fastify');
const { authMiddlewareInstance } = require("../../../../business/lib/auth/AuthMiddleware");
const TeacherSchemaResponseModel = require("../../schemas/responses/TeacherSchemaResponseModel");
const ClassResponseSchema = require("../../schemas/responses/ClassResponseSchema");

/**
 * 
 * @param { fastify.FastifyInstance } app 
 * @param {*} opts 
 * @param {*} done 
 */
module.exports = (app, opts, done) => {

    app.get(
        '/teacher/:id', 
        { 
            schema: {
                tags: ['Teacher'],
                params: idSchema.params,
                response: {
                    '200': {
                        type: 'object',
                        description: "Rota de obtenção dos dados de um professor",
                        properties: TeacherSchemaResponseModel
                    }
                }
            },
            preHandler: [
                authMiddlewareInstance.verifyToken
            ]
        },
        async (req, res) => await new TeacherController().getTeacher(req, res)
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
                },
                response: {
                    '200': {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: ClassResponseSchema
                        }
                    }
                }
            },
            preHandler: [
                authMiddlewareInstance.verifyToken,
                authMiddlewareInstance.requireTeacher,
            ]
        }, 
        async (req, res) => await new TeacherController().listTeacherClasses(req, res)
    );

    app.post(
        '/teacher', 
        { 
            schema: { 
                tags: ['Teacher'],
                body: createTeacherSchema.body, 
                response: IdResponseSchema().response 
            }
        },
        async (req, res) => await new TeacherController().createTeacher(req, res)
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
                response: IdResponseSchema().response 
            },
            preHandler: [
                authMiddlewareInstance.verifyToken,
                authMiddlewareInstance.requireTeacher,
            ]
        },
        async (req, res) => await new TeacherController().createTeacherStudent(req, res)
    );

    app.put(
        '/teacher/:id',
        {
            schema: {
                tags: ['Teacher'],
                params: idSchema.params
            }
        },
        async (req, res) => await new TeacherController().updateTeacher(req, res)
    );

    app.delete(
        '/teacher/student/:teacherId/:studentId',
        {
            schema: {
                tags: ['Teacher'],
                params: {
                    type: 'object',
                    required: ['teacherId', 'studentId'],
                    properties: {
                        teacherId: { type: 'string' },
                        studentId: { type: 'string' },
                    }
                }
            },
            preHandler: [
                authMiddlewareInstance.verifyToken,
                authMiddlewareInstance.requireTeacher,
            ]
        },
        async (req, res) => await new TeacherController().deleteTeacherStudent(req, res)
    );
    
    done()
}