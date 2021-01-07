const AuthController = require("../../controllers/AuthController");
const fastify = require('fastify');

const authController = new AuthController();

/**
 * 
 * @param { fastify.FastifyInstance } app 
 * @param {*} opts 
 * @param {*} done 
 */
module.exports = (app, opts, done) => {


    app.post(
        '/auth/login', 
        { 
            schema: { 
                tags: ['Auth'],
                body: {
                    type: 'object',
                    required: ['id', 'type', 'password'],
                    properties: {
                        id: { 
                            type: 'string',
                            minLength: 24,
                            maxLength: 24
                        },
                        type: { 
                            type: 'string',
                            enum: ["professor", "aluno"]
                        },
                        password: { type: 'string' },
                    }
                },
            }
        },
        async (req, res) => await authController.loginUser(req, res)
    );

    done()
}