module.exports = {
    page: { type: 'number' },
    limit: { type: 'number' },
    search: { type: 'string' },
    sort: { type: 'string' },
    sortType: { 
        type: 'number',
        enum: [-1, 1]
    },
}