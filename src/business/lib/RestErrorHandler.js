module.exports = function(error, request, reply) {
    // Send error response
    reply
        .status(error.httpStatus ?? 500)
        .send({ 
            status: error.httpStatus ?? 500,
            message: error.message
        })
};