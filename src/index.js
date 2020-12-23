// Require the framework and instantiate it
const ApiServer = require('./server');
const { api, server } = require("./config/config");
const path = require('path');


const apiServer = new ApiServer(server)

// Run the server!
const start = async () => {
  try {
    await apiServer
        .registerRouteContext({ path: path.join(__dirname, './rest/routes/v1/TeacherRoutes'), prefix: 'api/v1' })
        .initServer(api.port);

    apiServer.server.log.info(`server listening on ${apiServer.server.server.address().port}`)
  } catch (err) {
    apiServer.server.log.error(err)
    process.exit(1)
  }
}

module.exports = start
