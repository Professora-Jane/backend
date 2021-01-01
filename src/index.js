// Require the framework and instantiate it
const { restServerInstance } = require('./server/restServer');
const { wsServerInstance } = require('./server/wsServer');
const errorHandler = require("./business/lib/RestErrorHandler");
const config = require("./config/config");
const path = require('path');
const { dbInstance } = require('./db');
const { wsHandlerInstance } = require("./api/websocket/WsHandler")
const { wsConnectionsInstance } = require("./api/websocket/wsConnections")

// Run the server!
const start = async () => {
    try {
        await dbInstance.connect(config.db);
        
        //
        await restServerInstance
            .configureServer(config.server)
            .configureSwagger(config.openApi)
            .registerErrorHandler(errorHandler)
            .registerRoutes({ routesPath: path.join(__dirname, './api/rest/routes/v1/'), prefix: 'api/v1' })
            .initServer(config.api);

            restServerInstance.log.info(`server listening on ${ config.api.port }`)
        
        wsHandlerInstance
            .registerControllers({ 
                path: path.join(__dirname, './api/websocket/controllers/'),
                ignoreFiles: ["BaseController.js"]
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
