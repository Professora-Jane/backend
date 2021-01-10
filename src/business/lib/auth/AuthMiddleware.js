const { FastifyReply, FastifyRequest } = require("fastify");
const AuthService = require("../../services/AuthService");
const ForbiddenException = require("../httpExceptions/ForbiddenException");
const UnauthorizedException = require("../httpExceptions/UnauthorizedException");

const authService = new AuthService();

class AuthMiddleware {
    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */ 
    async requireTeacher(req, res) {
        if (req.user.type !== "professor")
            throw new ForbiddenException("Usuário sem permissão necessária")
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */ 
    async requireStudent(req, res) {
        if (req.user.type !== "aluno")
            throw new ForbiddenException("Usuário sem permissão necessária")
    }

    /**
     * 
     * @param { FastifyRequest } req 
     * @param { FastifyReply } res 
     */ 
    async verifyToken(req, res) {

        if (!req.headers.authorization)
            throw new UnauthorizedException("Token não informado");

        const token = req.headers.authorization.split("Bearer ")[1]

        if (!token)
            throw new UnauthorizedException("Token não informado");
        
        try {
            const userData = await authService.validateUserToken({ token })

            req.user = userData
        }
        catch(error) {
            throw new UnauthorizedException("Token inválido!!")
        }
    }
}

const instance = new AuthMiddleware();

module.exports = {
    authMiddlewareInstance: (() => instance)()
}