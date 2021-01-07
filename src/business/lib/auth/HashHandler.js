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
}

const instance = new HashHandler();

module.exports = {
    hashHandlerInstance: (() => instance)()
}