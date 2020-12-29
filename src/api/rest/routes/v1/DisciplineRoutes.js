const DisciplineController = require("../../controllers/DisciplineController");
const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const idSchema = require("../../schemas/requests/IdSchemaRequest");
const disciplineController = new DisciplineController();


module.exports = (app, opts, done) => {
    app.get(
        '/discipline/:id', 
        { 
            schema: idSchema 
        },
        async (req, res) => await disciplineController.getById(req, res)
    );

    app.post(
        '/discipline', 
        { 
            schema: { 
                body: {
                    type: 'object',
                    required: ['name', 'description'],
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' }
                    }
                }, 
                response: IdResponseSchema.response 
            }
        },
        async (req, res) => await disciplineController.createDiscipline(req, res)
    );

    app.get(
        '/disciplines',
        {
            schema: {
                query: {
                    page: { type: 'number' },
                    limit: { type: 'number' },
                    search: { type: 'string' }
                }
            }
        },
        async (req, res) => await disciplineController.listDisciplines(req, res)
    );
    
    done()
}