require('dotenv').config()

const startServer = require("./src/server"); 

(async () => {
    await startServer()
})()