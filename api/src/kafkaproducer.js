const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
// const PrettyConsoleLogger = require('./prettyConsoleLogger')

// const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    logLevel: logLevel.INFO,
    //   logCreator: PrettyConsoleLogger,
    brokers: ["correctiontool20_kafka_1:9092"],
    clientId: 'correction-tool-api-service',
})

const producer = kafka.producer()

// const createMessage = num => ({
//     key: `key-${num}`,
//     value: `value-${num}-${new Date().toISOString()}`,
//     headers: {
//         'correlation-id': `${num}-${Date.now()}`,
//     },
// })

// const run = async () => {
//     await producer.connect()
// }

// run().catch(e => kafka.logger().error(`[example/producer] ${e.message}`, { stack: e.stack }))


class MQProducer {
    static initializeConnection(){
        return producer.connect(); //return Promise
    }

    static publishToMQ(messageToSend) {
        console.log("publising to lista-correcao", messageToSend)
        return producer.send({
            topic: 'lista-correcao',
            messages: [{key: 'k', value: messageToSend}],
        })

    }
}

module.exports = MQProducer;