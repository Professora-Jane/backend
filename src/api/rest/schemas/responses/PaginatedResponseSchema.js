module.exports = (schema) => {
    return {
        response: {
            '2xx': {
                type: 'object',
                properties: {
                    items: { 
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: schema
                        }
                    },
                    numberOfItemsInPage: { type: 'number' },
                    currentPage: { type: 'number' },
                    totalPages: { type: 'number' },
                    totalItems: { type: 'number' }
                }
            }
        }
    }
}