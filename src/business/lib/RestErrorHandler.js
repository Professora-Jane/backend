module.exports = function(error, request, reply) {
    // Send error response
    reply
        .status(error.httpStatus)
        .send({ 
            message: error.message
        })
};