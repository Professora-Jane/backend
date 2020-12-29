module.exports = (schema) => {
    return {
        response: {
            '2xx': {
                type: 'object',
                properties: schema
            }
        }
    }
}