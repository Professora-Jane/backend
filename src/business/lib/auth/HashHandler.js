const bcrypt = require("bcrypt");

class HashHandler {
    constructor() {
        this.config = undefined
    }

    configureHandler(config) {
        this.config = config
    }

    async hashPassword(plainTextPassword) {
        return await bcrypt.hash(plainTextPassword, this.config.saltRounds)
    }

    async comparePassword(plainTextPassword, hashedPassword) {
        return await bcrypt.compare(plainTextPassword, hashedPassword)
    }

    validatePassword({ password, repeatedPassword }) {
        if (password !== repeatedPassword)
            throw new InvalidParamsException("As senhas informadas não são iguais")
        
        if (password.length < 8) 
        throw new InvalidParamsException("A senha deve ter no mínimo 8 caracteres")
    }
}

const instance = new HashHandler();

module.exports = {
    hashHandlerInstance: (() => instance)()
}