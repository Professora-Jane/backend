const DisciplineController = require("../../controllers/DisciplineController");
const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const idSchema = require("../../schemas/requests/IdSchemaRequest");
const DefaultPaginationQuery = require("../../schemas/requests/DefaultPaginationQuery");
const fastify = require('fastify');


/**
 * 
 * @param { fastify.FastifyInstance } app 
 * @param {*} opts 
 * @param {*} done 
 */
module.exports = (app, opts, done) => {
    app.get(
        '/discipline/:id', 
        { 
            schema: {
                tags: ['Disciplines'],
                params: idSchema.params
            } 
        },
        async (req, res) => await new DisciplineController().getById(req, res)
    );

    app.post(
        '/discipline', 
        { 
            schema: { 
                tags: ['Disciplines'],
                body: {
                    type: 'object',
                    required: ['name', 'description'],
                    properties: {
                        name: { type: 'string' },
                        description: { type: 'string' }
                    }
                }, 
                response: IdResponseSchema().response 
            }
        },
        async (req, res) => await new DisciplineController().createDiscipline(req, res)
    );

    app.get(
        '/disciplines',
        {
            schema: {
                tags: ['Disciplines'],
                query: DefaultPaginationQuery,
            }
        },
        async (req, res) => await new DisciplineController().listDisciplines(req, res)
    );
    
    done()
}