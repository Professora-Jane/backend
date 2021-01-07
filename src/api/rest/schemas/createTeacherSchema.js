const schema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'repeatedPassword', 'password'],
        properties: {
            name: { type: 'string' },
            email: { 
                type: 'string',
                format: 'email'
            },
            password: { 
                type: 'string',
                minLength: 8
            },
            repeatedPassword: { 
                type: 'string',
                minLength: 8
            },
        }
    },
}


module.exports = schema