const { Kafka, CompressionTypes, logLevel } = require('kafkajs')
// const PrettyConsoleLogger = require('./prettyConsoleLogger')

// const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    logLevel: logLevel.INFO,
    //   logCreator: PrettyConsoleLogger,
    brokers: ["correctiontool20_kafka_1:9092"],
    clientId: 'correction-tool-corrector-service',
})

const producer = kafka.producer()


class MQProducer {
    static initializeConnection(){
        return producer.connect(); //return Promise
    }

    static publishToMQ(messageToSend) {
        return producer.send({
            topic: 'lista-correcao-resposta',
            messages: [{value: messageToSend}],
        })
    }
}

module.exports = MQProducer;