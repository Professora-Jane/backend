const schema = {
    body: {
        type: 'object',
        required: ['name', 'email', 'cellPhone', 'password', 'repeatedPassword'],
        properties: {
            name: { type: 'string' },
            email: { 
                type: 'string',
                format: 'email'
            },
            cellPhone: { type: 'string' },
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