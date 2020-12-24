const fastify = require("fastify");
const fs = require("fs");

class Server {
    constructor() {
        this.server = undefined
    }

    registerRoutes({ routesPath, prefix }) {
        fs.readdirSync(routesPath).forEach(file => {
            this.server.register(require(routesPath + file), { prefix })
        });
        
        return this
    }

    configureServer(serverOpts) {
        this.server = fastify(serverOpts)
        return this
    }

    async initServer(apiOpts) {
        await this.server.listen(apiOpts.port)
        return this
    }
}

const instance = new Server();

module.exports = {
    serverInstance: (()=> instance)()
}