const BaseException = require("./BaseException");

class BadRequestException extends BaseException {
    constructor(message, payload) {
        super(message, payload)
    }
}

module.exports = BadRequestException
