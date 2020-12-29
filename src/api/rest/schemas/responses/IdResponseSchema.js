module.exports = (description = "Id do item criado") => ({
    response: {
        '201': {
            type: 'object',
            description,
            properties: {
                id: { type: 'string' }
            }
        }
    }
})