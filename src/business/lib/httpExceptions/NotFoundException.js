const BaseException = require("./BaseException");

class NotFoundException extends BaseException {
    constructor(message, payload) {
        super(message, payload, 404)
        this.httpStatus = 404
    }
}

module.exports = NotFoundException