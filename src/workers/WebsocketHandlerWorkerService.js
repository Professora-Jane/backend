const { wsConnectionsInstance } = require("../api/websocket/wsConnections");
const BaseWorkerService = require("../business/lib/workers/abstracts/BaseWorkerService");

/**
 * @class
 * @extends { BaseWorkerService }
 */
class WebsocketHandlerWorkerService extends BaseWorkerService {

    constructor() {
        super({
            topic: "notify.clients.websocket"
        })
    }

    /**
     * 
     * @param { object } msg 
     * @param { Array<string> } msg.to - Array de ids para os quais a mensagem será enviada 
     * @param { string } msg.topic - Tópico no qual a mensagem será enviada
     * @param { string | object } msg.content - conteúdo da mensagem
     */
    async execute({ to, topic, content }) {
        if (typeof content === "string")
            content = JSON.parse(content)

        to.map(id => {
            const sockets = wsConnectionsInstance.getSockets(id)

            if (sockets) {
                sockets.map(item => item.send(topic, content))
            }
        })
    }

    doOnError(err, originalMsg) {
        console.error(err, originalMsg)
    }
}

module.exports = WebsocketHandlerWorkerService
