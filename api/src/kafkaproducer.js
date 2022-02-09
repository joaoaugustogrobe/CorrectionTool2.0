var amqp = require('amqplib');


class MQProducer {
    static channel = null;
    static async initializeConnection(){
        // return producer.connect(); //return Promise
        let connection = await amqp.connect('amqps://uwpafgqx:BEs1jYgp8RkBYu6JsE9V5LlN8DOa3TNY@porpoise.rmq.cloudamqp.com/uwpafgqx');
        this.channel = await connection.createChannel();
        await this.channel.assertQueue("lista-correcao");
    }

    static async publishToMQ(messageToSend) {
        if(!this.channel) throw 'Connection not ready';
        await this.channel.sendToQueue("lista-correcao", Buffer.from(messageToSend))

        console.log("publising to lista-correcao")
    }
}

module.exports = MQProducer;
