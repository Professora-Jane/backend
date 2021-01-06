module.exports = {
    api: {
        port: process.env.PORT || 7111,
        timezone: process.env.TZ
    },
    server: {
        logger: process.env.SERVER_LOGGER || true
    },
    peer: {
        port: process.env.PEER_PORT || 7113,
        key: process.env.PEER_KEY
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING,
        options: {
            useNewUrlParser: process.env.MONGODB_USE_URL_PARSER || true,
            useUnifiedTopology: process.env.MONGODB_USE_UNIFIED_TOPOLOGY || true
        },
        retryAttempts: 3,
        retryTimeout: 5000
    },
    webSocket: {
        port: process.env.WS_PORT || 7112
    },
    openApi: {
        routePrefix: '/documentation',
        swagger: {
            info: {
                title: 'Test swagger',
                description: 'testing the fastify swagger api',
                version: '0.1.0'
            },
            externalDocs: {
                url: 'https://swagger.io',
                description: 'Find more info here'
            },
            host: 'localhost:7111',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                { name: 'Students', description: 'Endpoints relacionados à ações de estudantes' },
                { name: 'Class', description: 'Endpoints relacionados à ações de classes' },
                { name: 'Disciplines', description: 'Endpoints relacionados à ações de disciplinas' },
                { name: 'Teacher', description: 'Endpoints relacionados à ações de professores' },
            ],
        },
        exposeRoute: true
    }
}