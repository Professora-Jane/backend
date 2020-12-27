const BaseException = require("./BaseException");

class NotFoundException extends BaseException {
    constructor(message, payload) {
        super(message, payload)
    }
}

module.exports = NotFoundException
