const NotFoundException = require("./httpExceptions/NotFoundException");
const InvalidParamsException = require("./httpExceptions/InvalidParamsException");
const ConflictException = require("./httpExceptions/ConflictException");

module.exports = function(error, request, reply) {
    // Send error response
    const formattedError = {
        status: 500, // Internal server error by default,
        error: "InternalServerError",
        message: error.message || error.stack,
        ...(error.payload && {extension: error.payload})
    }

    if (error instanceof NotFoundException) {
        formattedError.status = 404
        formattedError.error = "Not Found"
    }
    else if (error instanceof ConflictException) {
        formattedError.status = 409
        formattedError.error = "Conflict"
    }
    else if (
        error instanceof InvalidParamsException 
        || error.validation ){
        formattedError.error = "Bad Request"
        formattedError.status = 400
    }

    reply
        .status(formattedError.status)
        .send(formattedError)
};