const ClassController = require("../../controllers/ClassController");
const IdResponseSchema = require("../../schemas/responses/IdResponseSchema");
const idSchema = require("../../schemas/requests/IdSchemaRequest");
const fastify = require('fastify');
const ClassResponseSchema = require("../../schemas/responses/ClassResponseSchema");

/**
 * 
 * @param { fastify.FastifyInstance } app 
 * @param {*} opts 
 * @param {*} done 
 */
module.exports = (app, opts, done) => {

    app.get(
        '/class/:id', 
        { 
            schema: { 
                tags: ['Class'],
                params: idSchema.params,
                response: {
                    response: {
                        '200': {
                            type: 'object',
                            properties: ClassResponseSchema
                        }
                    }
                }
            }
        },
        async (req, res) => await new ClassController().getClass(req, res)
    );

    app.post(
        '/class', 
        { 
            schema: { 
                tags: ['Class'],
                body: {
                    type: 'object',
                    required: ['studentId', 'teacherId', 'startTime', 'endTime', 'daysOfWeek', 'discipline'],
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
                        startTime: { type: 'string' },
                        endTime: { type: 'string' },
                        daysOfWeek: { 
                            type: 'array',
                            maxItens: 7,
                            items: {
                                type: 'number',
                                enum: [0,1,2,3,4,5,6]
                            }
                        },
                        discipline: { 
                            type: 'string',
                            minLength: 24,
                            maxLength: 24
                        },
                    }
                }, 
                response: IdResponseSchema().response 
            }
        },
        async (req, res) => await new ClassController().createClass(req, res)
    );

    done()
}