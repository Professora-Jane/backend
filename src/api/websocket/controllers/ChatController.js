const BaseWsController = require("./BaseController")

class ChatController  extends BaseWsController {
    constructor() {
        super()
    }

    on_chat(value) {
        console.log(value)
    }
}

module.exports = new ChatController()
