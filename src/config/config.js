module.exports = {
    api: {
        port: process.env.PORT
    },
    server: {
        logger: true
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING
    }
}