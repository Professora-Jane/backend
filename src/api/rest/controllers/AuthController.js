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
        const { email, id, type, password } = req.body
        
        const response = await this.authService.authenticateUser({ email, id, type, password })
        
        res
            .code(200)
            .send(response);
    }
}

module.exports = AuthController