const BaseException = require("./BaseException");

class ForbiddenException extends BaseException {
    constructor(message, payload) {
        super(message, payload)
    }
}

module.exports = ForbiddenException
