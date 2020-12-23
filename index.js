require('dotenv').config()

const startServer = require("./src"); 

(async () => {
    await startServer()
})()