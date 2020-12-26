// Require the framework and instantiate it
const { restServerInstance } = require('./server/restServer');
const { wsServerInstance } = require('./server/wsServer');
const errorHandler = require("./business/lib/RestErrorHandler");
const config = require("./config/config");
const path = require('path');
const { dbInstance } = require('./db');
const { wsHandlerInstance } = require("./api/websocket/WsHandler")

// Run the server!
const start = async () => {
    try {
        await dbInstance.connect(config.db);
        
        //
        await restServerInstance
            .configureServer(config.server)
            .registerErrorHandler(errorHandler)
            .registerRoutes({ routesPath: path.join(__dirname, './api/rest/routes/v1/'), prefix: 'api/v1' })
            .initServer(config.api);

            restServerInstance.log.info(`server listening on ${ api.port }`)
        
        wsHandlerInstance
            .registerControllers({ 
                path: path.join(__dirname, './api/websocket/controllers/'),
                ignoreFiles: ["BaseController.js"]
            })

        wsServerInstance
            .registerOnMessageHandler(wsHandlerInstance.messageHandler)
            .initServer(config.webSocket);
    } 
    catch (err) {
        restServerInstance.log.error(err)
        process.exit(1)
    }
}

module.exports = start
