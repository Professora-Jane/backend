const zmq = require("zeromq");
const DefaultStrategy = require("../abstracts/DefaultStrategy");
const { workerTypes } = require("../WorkerPool");

class ZeroMqStrategy extends DefaultStrategy {
    constructor() {
        super()
        this.pubSock = new zmq.Publisher
        this.workers = []
        this.config = undefined
        this.pubsubPublisher = undefined
    }

    configStrategy(config) {
        this.config = config
    }

    async addWorker(worker, { workerType  }) {

        if (workerType === workerTypes.pubsub) {

            /**
             * @type {zmq.Subscriber} worker.socket
             */
            worker.socket = new zmq.Subscriber
            worker.socket.connect(this.config.host)
    
            worker.socket.subscribe(worker.topic)

            for await (const [_, content] of worker.socket) {
                await worker.execute(this.convertMessage(content))
            }
        }

        return this;
    }

    convertMessage(msg) {
        return JSON.parse(new TextDecoder("utf-8").decode(msg));

    }

    async publishPubSub(topic, content) {
        
        if (!this.pubsubPublisher) {
            this.pubsubPublisher = new zmq.Publisher
    
            await this.pubsubPublisher.bind(this.config.host)
        }

        if (typeof content === "object") 
            content = JSON.stringify(content)
        
        await this.pubsubPublisher.send([topic, content])
    } 
}

module.exports = ZeroMqStrategy
