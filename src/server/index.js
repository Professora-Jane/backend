const fastify = require('fastify')


class Server {
    constructor(otps) {
        this.server = fastify(otps)
    }

    registerRouteContext({ path, prefix }) {
        this.server.register(require(path), { prefix })
        return this
    }

    async initServer(port) {
        await this.server.listen(port)
        return this
    }
}

module.exports = Server