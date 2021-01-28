const ws = require("ws");

ws.prototype.oldSend = ws.prototype.send;

ws.prototype.send = function(eventName, payload)  {        
    
    const message = {
        type: eventName,
        content: payload
    }

    ws.prototype.oldSend.apply(this, [JSON.stringify(message)]);
}

class WsServer {
    constructor() {
        /**
         * @type { ws.Server }
         * @public
         */
        this.wsServer = undefined

        /**
         * @type { function }
         * @public
         */
        this.onConnectionHandler = undefined

        /**
         * @type { function }
         * @public
         */
        this.onMessageHandler = undefined

        /**
         * @type { function }
         * @public
         */
        this.onCloseHandler = undefined
    }

    initServer(opts) {
        this.wsServer = new ws.Server({
            port: opts.port
        });

        this.wsServer.on('connection', (ws, req) => {

            this.onConnectionHandler && this.onConnectionHandler(ws, req)

            ws.on('message', (msg)  => {
                this.onMessageHandler && this.onMessageHandler(ws, req, msg)
            })

            ws.on('close', () => this.onCloseHandler && this.onCloseHandler(ws, req))
        })
    }

    /**
     * @function registerOnMessageHandler Função responsável por registrar o callback de retorno no recebimento de mensagens socket
     * @param { requestCallback } cb - Callback de retorno 
     * @callback requestCallback 
     * @param { ws }  ws - Instância atual do socket
     * @param { IncomingMessage } req 
     * @param { string } msg - mensagem stringficada
     */
    registerOnMessageHandler(cb) {
        this.onMessageHandler = cb

        return this
    }
    
    /**
     * @function registerOnCloseHandler Função responsável por registrar o callback de erro
     * @param { requestCallback } cb - Callback de retorno 
     * @callback requestCallback 
     * @param { ws }  ws - Instância atual do socket
     * @param { IncomingMessage } req
     */
    registerOnCloseHandler(cb) {
        this.onCloseHandler = cb

        return this
    }
    
    /**
     * @function registerOnConnectionHandler Função responsável por registrar o callback de conexão de um socket
     * @param { requestCallback } cb - Callback de retorno 
     * @callback requestCallback 
     * @param { ws }  ws - Instância atual do socket
     * @param { IncomingMessage } req 
     * @param { string } msg - mensagem stringficada
     */
    registerOnConnectionHandler(cb) {
        this.onConnectionHandler = cb

        return this
    }
}

const instance = new WsServer()

module.exports = {
    wsServerInstance: (()=> instance)()
}