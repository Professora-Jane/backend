require('dotenv').config()

const startServer = require("./src"); 
const config = require('./src/config/config');
const { hashHandlerInstance } = require('./src/business/lib/auth/HashHandler');
const { authHandlerInstance } = require('./src/business/lib/auth/AuthHandler');
const { dbInstance } = require('./src/db/index');
const { redisDbInstance } = require('./src/db/redis');
const { ZeroMqProvider, workerPoolInstance, workerTypes } = require("@prof_jane/node-utils");
const WebsocketHandlerWorkerService = require('./src/workers/WebsocketHandlerWorkerService');


(async () => {
    await dbInstance.connect(config.db);

    await redisDbInstance
        .config(config.redis)
        .connect({ prefix: "professoraJane" });

    hashHandlerInstance.configureHandler(config.hash)
    authHandlerInstance.configureHandler(config.auth)

    await workerPoolInstance
        .addProvider(ZeroMqProvider, 'zeroMq', config.workerStrategies.zeroMq)
        .addWorker(new WebsocketHandlerWorkerService(), { providerName: 'zeroMq', workerType: workerTypes.pubsub })
        .init()

    await startServer()
})()