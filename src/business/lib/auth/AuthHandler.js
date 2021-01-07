const jwt = require("jsonwebtoken");

class AuthHandler {
    constructor() {
        this.config = undefined
    }

    sign(payload) {
        const signedToken = jwt.sign(payload, this.config.secret, this.config.jwtOptions)

        return signedToken;
    }

    configureHandler(config) {
        if (!this.config)
            this.config = config
    }

    verify(token) {
        const verifiedToken = jwt.verify(token, this.config.secret);

        return verifiedToken;
    }
}

const instance = new AuthHandler();

module.exports = {
    authHandlerInstance: (() => instance)()
}