module.exports = {
    api: {
        port: process.env.PORT || 7111,
        timezone: process.env.TZ
    },
    server: {
        logger: process.env.SERVER_LOGGER || true
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING,
        options: {
            useNewUrlParser: process.env.MONGODB_USE_URL_PARSER || true,
            useUnifiedTopology: process.env.MONGODB_USE_UNIFIED_TOPOLOGY || true
        }
    }
}