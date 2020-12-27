const NotFoundException = require("./httpExceptions/NotFoundException");

module.exports = function(error, request, reply) {
    // Send error response
    const formattedError = {
        status: 500, // Internal server error by default,
        message: error.message || error.stack,
        ...(error.payload && {extension: error.payload})
    }

    if (error instanceof NotFoundException)
        formattedError.status = 404


    reply
        .status(formattedError.status)
        .send(formattedError)
};