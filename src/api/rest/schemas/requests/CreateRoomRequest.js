const schema = {
    body: {
        type: 'object',
        required: ['name', 'adminId'],
        properties: {
            name: { type: 'string' },
            adminId: { 
                type: 'string',
                minLength: 24,
                maxLength: 24
            }
        }
    },
}


module.exports = schema