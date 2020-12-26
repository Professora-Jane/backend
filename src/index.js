// Require the framework and instantiate it
const { restServerInstance } = require('./server/restServer');
const { wsServerInstance } = require('./server/wsServer');
const errorHandler = require("./business/lib/RestErrorHandler");
const { api, server, db, webSocket } = require("./config/config");
const path = require('path');
const { dbInstance } = require('./db');


// Run the server!
const start = async () => {
    try {
        await dbInstance.connect(db);
        
        //
        await restServerInstance
            .configureServer(server)
            .registerErrorHandler(errorHandler)
            .registerRoutes({ routesPath: path.join(__dirname, './rest/routes/v1/'), prefix: 'api/v1' })
            .initServer(api);

            restServerInstance.log.info(`server listening on ${ api.port }`)
        
        wsServerInstance
            .registerOnMessageHandler((ws, req, msg) => {
                console.log(msg); 
                ws.send('qqCoisa', {teste: msg})
            })
            .initServer(webSocket);
    } 
    catch (err) {
        restServerInstance.log.error(err)
        process.exit(1)
    }
}

module.exports = start
