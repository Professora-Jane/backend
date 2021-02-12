const BaseWsSubscriber = require("./BaseSubscriber")

class ChatSubscriber  extends BaseWsSubscriber {
    constructor() {
        super()
    }

    ["on_chat:enter"](ws, value) {
        console.log(value)
        ws.send('chat', { message: "qweqwe"})
    }
}

module.exports = new ChatSubscriber()
