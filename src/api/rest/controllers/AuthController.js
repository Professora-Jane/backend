const { FastifyReply, FastifyRequest } = require("fastify");
const AuthService = require("../../../business/services/AuthService");

class AuthController {

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */
    async loginUser(req, res) {
        const { id, type, password } = req.body
        
        const response = await this.authService.authenticateUser({ id, type, password })
        
        res
            .code(200)
            .send(response);
    }
}

module.exports = AuthController