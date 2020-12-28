const BaseException = require("./BaseException");

class InvalidParamsException extends BaseException {
    constructor(message, payload) {
        super(message, payload)
    }
}

module.exports = InvalidParamsException
