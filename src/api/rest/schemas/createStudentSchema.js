const schema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'cellPhone'],
        properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            cellPhone: { type: 'string' }
        }
    },
}


module.exports = schema