class BaseException extends Error {
    constructor(message, payload, httpStatus) {
        super(message)
        this.payload = payload
        this.httpStatus = httpStatus
    }
}

module.exports = BaseException