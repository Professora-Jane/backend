const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const idSchema = require("../../schemas/requests/IdSchemaRequest");
const createStudentSchema = require("../../schemas/requests/CreateStudentRequest");
const StudentController = require("../../controllers/StudentController");
const PaginatedResponseSchema = require("../../schemas/responses/PaginatedResponseSchema");
const StudentSchemaResponseModel = require("../../schemas/responses/StudentSchemaResponseModel");
const DefaultPaginationQuery = require("../../schemas/requests/DefaultPaginationQuery");
const DefaultResponseModel = require("../../schemas/responses/DefaultResponseModel");
const { authMiddlewareInstance } = require("../../../../business/lib/auth/AuthMiddleware")
const fastify = require('fastify');
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
        '/student/:id', 
        { 
            schema: { 
                tags: ['Students'],
                params: idSchema.params,
                response: DefaultResponseModel(StudentSchemaResponseModel).response
            }
        },
        async (req, res) => await new StudentController().getById(req, res)
    );
    
    app.get(
        '/student/list/byTeacher/:id', 
        { 
            schema: { 
                tags: ['Students'],
                params: idSchema.params,
                query: DefaultPaginationQuery,
                response: PaginatedResponseSchema(StudentSchemaResponseModel).response
            },
            preHandler: [
                authMiddlewareInstance.verifyToken
            ]
        },
        async (req, res) => await new StudentController().listByTeacherId(req, res)
    );
    
    app.get(
        '/student/list/teachers/:id', 
        { 
            schema: { 
                tags: ['Students'],
                params: idSchema.params,
                query: DefaultPaginationQuery,
                response: PaginatedResponseSchema(TeacherSchemaResponseModel).response
            },
            preHandler: [
                authMiddlewareInstance.verifyToken
            ]
        },
        async (req, res) => await new StudentController().listTeachers(req, res)
    );
    
    app.get(
        '/student/list/classes/:id', 
        { 
            schema: { 
                tags: ['Students'],
                params: idSchema.params,
                query: {
                    teacherId: {
                        type: 'string',
                        minLength: 24,
                        maxLength: 24
                    }
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
                authMiddlewareInstance.verifyToken
            ]
        },
        async (req, res) => await new StudentController().listClasses(req, res)
    );

    app.post(
        '/student', 
        { 
            schema: { 
                tags: ['Students'],
                body: createStudentSchema.body, 
                response: IdResponseSchema("Id do estudante criado").response
            }
        }, 
        async (req, res) => await new StudentController().createStudent(req, res)
    );

    done()
}