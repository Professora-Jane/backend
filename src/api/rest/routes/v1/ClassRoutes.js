const ClassController = require("../../controllers/ClassController");
const IdResponseSchema = require("../../schemas/IdResponseSchema");
const idSchema = require("../../schemas/IdSchema");

const classController = new ClassController();

module.exports = (app, opts, done) => {

    app.get(
        '/class/:id', 
        { 
            schema: { 
                params: idSchema.params
            }
        },
        async (req, res) => await classController.getClass(req, res)
    );

    app.post(
        '/class', 
        { 
            schema: { 
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
                response: IdResponseSchema.response 
            }
        },
        async (req, res) => await classController.createClass(req, res)
    );

    done()
}