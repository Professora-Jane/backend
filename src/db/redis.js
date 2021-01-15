const nohm = require('nohm').Nohm;
const redis = require('redis')


class RedisDb {
    
    constructor() {
        /**
         * @type {redis.ClientOpts}
         */
        this.redisConfig = undefined

        /**
         * @type {redis.RedisClient}
         */
        this.redisDb = undefined

        /**
         * @type {function}
         */
        this.onConnectHandler = undefined

        this.nohm = nohm;
    }
    
    config(redisConfig) {
        this.redisConfig = redisConfig

        return this
    }

    connect({ prefix }) {
        this.redisDb = redis.createClient(this.redisConfig)

        return new Promise( resolve => {
            this.redisDb.on("connect", () => {
                this.nohm.setClient(this.redisDb)
                this.onConnectHandler && this.onConnectHandler()

                this.nohm.setPrefix(prefix)
                resolve()
            })
        })
    }

    
    /**
     * @function registerOnConnectHandler Função responsável por registrar o callback de conexão
     * @param { requestCallback } cb - Callback de retorno 
     * @callback requestCallback 
     */
    registerOnConnectHandler(handler) {
        this.onConnectHandler = handler
    }


}

const instance = new RedisDb();

module.exports = {
    redisDbInstance: (() => instance)()
}