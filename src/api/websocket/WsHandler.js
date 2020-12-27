const pubsub = require("pubsub-js");
const { wsConnectionsInstance } = require("./wsConnections");
const fs = require("fs");

class WsHandler {

    messageHandler(ws, req, msg) {

        const { type, content } = JSON.parse(msg)
        
        if (type === "connection") {
            // TODO alterar para receber o id do usuário via req;
            ws.id = content.id

            wsConnectionsInstance.addSocket(ws)
        }
        else {
            pubsub.publish(type, content)
        }
    }

    /**
     * @description Método responsável por registrar os handlers (aqui chamados de controllers) websockets.
     * Eles funcionam através de um sistema pub-sub (usando o pubsub-js), e todos os métodos considerados subscribers devem começar com 
     * "on_<topic>". A inscrição é feita de forma automática desde que essa convenção seja seguida.
     * @param { object } param 
     * @param { string } param.path - Caminho da pasta onde ficam localizadas as controllers 
     * @param { Array<string> } param.ignoreFiles - Array de arquivos que devem ser ignorados 
     */
    registerControllers({ path, ignoreFiles }) {
        fs.readdirSync(path).forEach(file => {
            if (!ignoreFiles.includes(file)) {
                let  tempClass = require(path + file);
    
                let props = [];
                let obj = tempClass;
                do {
                    props = props.concat(Object.getOwnPropertyNames(obj));
                } 
                while (obj = Object.getPrototypeOf(obj));
    
                props
                    .filter(function(e, i, arr) { 
                        if (e!=arr[i+1] && 
                            typeof tempClass[e] == 'function' &&
                            e.startsWith("on_")) return true;
                    })
                    .map(classMethod => {
                        pubsub.subscribe(classMethod.replace("on_", ""), async (_, value) => await tempClass[classMethod](value))
                    })
            }
        });
    }
}

const instance = new WsHandler();

module.exports = {
    wsHandlerInstance:  (() => instance)()
}