const IdResponseSchema = require("../../schemas/IdResponseSchema");
const idSchema = require("../../schemas/IdSchema");
const createStudentSchema = require("../../schemas/createStudentSchema");
const StudentController = require("../../controllers/StudentController");

const studentController = new StudentController();

module.exports = (app, opts, done) => {
    
    app.get(
        '/student/:id', 
        { 
            schema: { 
                params: idSchema.params
            }
        },
        async (req, res) => await studentController.getById(req, res)
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

    // app.put('/teacher/:id', async (req, res) => await studentController.updateTeacher(req, res));
    done()
}