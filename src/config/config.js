module.exports = {
    nodeEnv: process.env.NODE_ENV,
    api: {
        port: process.env.PORT,
        timezone: process.env.TZ
    },
    server: {
        logger: process.env.SERVER_LOGGER
    },
    peer: {
        port: process.env.PEER_PORT
    },
    db: {
        connectionString: process.env.DB_CONNECTION_STRING,
        options: {
            useNewUrlParser: process.env.MONGODB_USE_URL_PARSER,
            useUnifiedTopology: process.env.MONGODB_USE_UNIFIED_TOPOLOGY 
        },
        retryAttempts: process.env.MONGODB_RETRY_ATTEMPTS,
        retryTimeout: process.env.MONGODB_RETRY_TIMEOUT
    },
    redis: {
        port: process.env.REDIS_PORT
    },
    hash: {
        saltRounds: 10
    },
    auth: {
        secret: process.env.AUTH_SECRET,
        jwtOptions: {
            expiresIn: process.env.AUTH_JWT_EXPIRES_IN
        }
    },
    webSocket: {
        port: process.env.WS_PORT
    },
    openApi: {
        routePrefix: '/docs',
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
                { name: 'Auth', description: 'Endpoints relacionados à ações autenticação' },
                { name: 'Students', description: 'Endpoints relacionados à ações de estudantes' },
                { name: 'Class', description: 'Endpoints relacionados à ações de classes' },
                { name: 'Disciplines', description: 'Endpoints relacionados à ações de disciplinas' },
                { name: 'Teacher', description: 'Endpoints relacionados à ações de professores' },
            ],
        },
        exposeRoute: true
    }
}