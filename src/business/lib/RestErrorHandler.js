const NotFoundException = require("./httpExceptions/NotFoundException");
const InvalidParamsException = require("./httpExceptions/InvalidParamsException");
const ConflictException = require("./httpExceptions/ConflictException");
const ForbiddenException = require("./httpExceptions/ForbiddenException");
const UnauthorizedException = require("./httpExceptions/UnauthorizedException");
const BadRequestException = require("./httpExceptions/BadRequestException");

module.exports = function(error, request, reply) {
    // Send error response
    const formattedError = {
        status: 500, // Internal server error by default,
        error: "InternalServerError",
        message: error.message || error.stack,
        ...(error.payload && {extension: error.payload})
    }

    if (error instanceof BadRequestException ||
        error instanceof InvalidParamsException 
        || error.validation) {
        formattedError.status = 400
        formattedError.error = "Bad Request"
    }
    else if (error instanceof UnauthorizedException) {
        formattedError.status = 401
        formattedError.error = "Unauthorized"
    }
    else if (error instanceof ForbiddenException) {
        formattedError.status = 403
        formattedError.error = "Forbidden"
    }
    else if (error instanceof NotFoundException) {
        formattedError.status = 404
        formattedError.error = "Not Found"
    }
    else if (error instanceof ConflictException) {
        formattedError.status = 409
        formattedError.error = "Conflict"
    }

    reply
        .status(formattedError.status)
        .send(formattedError)
};