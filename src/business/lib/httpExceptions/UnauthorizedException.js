const BaseException = require("./BaseException");

class UnauthorizedException extends BaseException {
    constructor(message, payload) {
        super(message, payload)
    }
}

module.exports = UnauthorizedException
