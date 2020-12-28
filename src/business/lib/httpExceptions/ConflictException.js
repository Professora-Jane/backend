const BaseException = require("./BaseException");

class ConflictException extends BaseException {
    constructor(message, payload) {
        super(message, payload)
    }
}

module.exports = ConflictException
