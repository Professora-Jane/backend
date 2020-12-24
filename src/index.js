// Require the framework and instantiate it
const { serverInstance } = require('./server');
const { api, server, db } = require("./config/config");
const path = require('path');
const { dbInstance } = require('./db');


// Run the server!
const start = async () => {
    try {
        await dbInstance.connect(db);
        
        //
        await serverInstance
            .configureServer(server)
            .registerRoutes({ routesPath: path.join(__dirname, './rest/routes/v1/'), prefix: 'api/v1' })
            .initServer(api);

            serverInstance.server.log.info(`server listening on ${serverInstance.server.server.address().port}`)
    } 
    catch (err) {
        serverInstance.server.log.error(err)
        process.exit(1)
    }
}

module.exports = start
