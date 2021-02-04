require('dotenv').config()

const startServer = require("./src"); 
const config = require('./src/config/config');
const { hashHandlerInstance } = require('./src/business/lib/auth/HashHandler');
const { authHandlerInstance } = require('./src/business/lib/auth/AuthHandler');
const { dbInstance } = require('./src/db/index');
const { redisDbInstance } = require('./src/db/redis');
const { workerPoolInstance, workerTypes } = require('./src/business/lib/workers/WorkerPool');
const ZeroMqStrategy = require('./src/business/lib/workers/strategies/ZeroMqStrategy');
const WebsocketHandlerWorkerService = require('./src/workers/WebsocketHandlerWorkerService');


(async () => {
    await dbInstance.connect(config.db);

    await redisDbInstance
        .config(config.redis)
        .connect({ prefix: "professoraJane" });

    hashHandlerInstance.configureHandler(config.hash)
    authHandlerInstance.configureHandler(config.auth)

    await workerPoolInstance
        .addStrategy(ZeroMqStrategy, 'zeroMq', config.workerStrategies.zeroMq)
        .addWorker(new WebsocketHandlerWorkerService(), { strategyName: 'zeroMq', workerType: workerTypes.pubsub })
        .init()

    await startServer()
})()