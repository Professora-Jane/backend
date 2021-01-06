const BaseWsController = require("./BaseController")

class ChatController  extends BaseWsController {
    constructor() {
        super()
    }

    ["on_chat:enter"](ws, value) {
        console.log(value)
        ws.send('chat', { message: "qweqwe"})
    }
}

module.exports = new ChatController()
