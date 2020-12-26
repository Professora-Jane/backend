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
                id: { type: 'string' }
            }
        }
    }
}


module.exports = schema