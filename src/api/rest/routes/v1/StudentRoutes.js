const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const idSchema = require("../../schemas/requests/IdSchemaRequest");
const createStudentSchema = require("../../schemas/requests/CreateStudentRequest");
const StudentController = require("../../controllers/StudentController");
const PaginatedResponseSchema = require("../../schemas/responses/PaginatedResponseSchema");
const StudentSchemaResponseModel = require("../../schemas/responses/StudentSchemaResponseModel");
const DefaultPaginationQuery = require("../../schemas/requests/DefaultPaginationQuery");
const DefaultResponseModel = require("../../schemas/responses/DefaultResponseModel");

const studentController = new StudentController();

module.exports = (app, opts, done) => {
    
    app.get(
        '/student/:id', 
        { 
            schema: { 
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
                params: idSchema.params,
                query: DefaultPaginationQuery,
                response: PaginatedResponseSchema(StudentSchemaResponseModel).response
            }
        },
        async (req, res) => await studentController.listByTeacherId(req, res)
    );

    app.post(
        '/student', 
        { 
            schema: { 
                body: createStudentSchema.body, 
                response: IdResponseSchema.response
            }
        }, 
        async (req, res) => await studentController.createStudent(req, res)
    );

    done()
}