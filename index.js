require('dotenv').config()

const startServer = require("./src"); 
const config = require('./src/config/config');
const { hashHandlerInstance } = require('./src/business/lib/auth/HashHandler');
const { authHandlerInstance } = require('./src/business/lib/auth/AuthHandler');


(async () => {
    hashHandlerInstance.configureHandler(config.hash)
    authHandlerInstance.configureHandler(config.auth)

    await startServer()
})()