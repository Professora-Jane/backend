const peer = require('peer');

class PeerServer  {
    constructor() {
        this.server = undefined

        /**
         * @type { function }
         * @public
         */
        this.onConnectionHandler = undefined

        /**
         * @type { function }
         * @public
         */
        this.onCloseHandler = undefined
    }

    initServer(config) {
        this.server = peer.PeerServer(config)
        
        this.server.on('connection', (client) => {
            this.onConnectionHandler && this.onConnectionHandler(client)
        })
        
        this.server.on('disconnect', (client) => {
            this.onCloseHandler && this.onCloseHandler(client)
        })
    }

    /**
     * @function registerOnCloseHandler Função responsável por registrar o callback de erro
     * @param { requestCallback } cb - Callback de retorno 
     */
    registerOnCloseHandler(cb) {
        this.onCloseHandler = cb

        return this
    }
    
    /**
     * @function registerOnConnectionHandler Função responsável por registrar o callback de conexão de um socket
     * @param { requestCallback } cb - Callback de retorno 
     */
    registerOnConnectionHandler(cb) {
        this.onConnectionHandler = cb

        return this
    }
}

const instance = new PeerServer();


module.exports = {
    peerServerInstance: (() => instance)()
}