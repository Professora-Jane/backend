// Require the framework and instantiate it
const { restServerInstance } = require('./server/restServer');
const { wsServerInstance } = require('./server/wsServer');
const errorHandler = require("./business/lib/RestErrorHandler");
const config = require("./config/config");
const path = require('path');
const { wsHandlerInstance, wsConnectionsInstance } = require("@prof_jane/node-utils");

// Run the server!
const start = async () => {
    try {        
        await restServerInstance
            .configureServer(config.server)
            .configureSwagger(config.openApi)
            .registerErrorHandler(errorHandler)
            .registerRoutes({ routesPath: path.join(__dirname, './api/rest/routes/v1/'), prefix: 'api/v1' })
            .initServer(config.api);

        restServerInstance.log.info(`server listening on ${ config.api.port }`)
        
        wsHandlerInstance
            .registerSubscribers({ 
                path: path.join(__dirname, './api/websocket/subscribers/'),
                ignoreFiles: ["BaseSubscriber.js"]
            })

        wsServerInstance
            .registerOnMessageHandler((ws, req, msg) => wsHandlerInstance.messageHandler(ws, req, msg))
            .registerOnCloseHandler((ws, req) => wsConnectionsInstance.removeSocket(ws, req))
            .initServer(config.webSocket);
    } 
    catch (err) {
        restServerInstance.log.error(err)
        process.exit(1)
    }
}

module.exports = start
