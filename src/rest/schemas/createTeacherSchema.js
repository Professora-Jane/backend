const server = require("../../server")
const schema = {
    body: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string' }
        }

    },
    response: {
        '2xx': {
            type: 'object',
            properties: {
                success: { type: 'boolean' }
            }
        }
    }
}


module.exports = schema