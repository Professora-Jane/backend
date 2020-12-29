const fastify = require("fastify");
const { FastifyInstance } = require("fastify");
const fs = require("fs");

class RestServer {


    constructor() {
        /**
         * @type { FastifyInstance }
         * @public
         */
        this.server = undefined
    }

    get log() {
        return this.server.log;
    }

    registerRoutes({ routesPath, prefix }) {
        fs.readdirSync(routesPath).forEach(file => {
            this.server.register(require(routesPath + file), { prefix })
        });
        
        return this;
    }

    registerErrorHandler(handler) {
        this.server.setErrorHandler(handler)
        return this;
    }

    configureServer(serverOpts) {
        this.server = fastify(serverOpts);
        this.server.register(require("fastify-cors"));
        
        return this;
    }

    async initServer(apiOpts) {
        await this.server.listen(apiOpts.port);
        return this;
    }
}

const instance = new RestServer();

module.exports = {
    restServerInstance: (()=> instance)()
}