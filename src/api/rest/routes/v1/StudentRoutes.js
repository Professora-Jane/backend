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

const studentController = new StudentController();

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
        async (req, res) => await studentController.getById(req, res)
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
        async (req, res) => await studentController.listByTeacherId(req, res)
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
        async (req, res) => await studentController.createStudent(req, res)
    );

    done()
}