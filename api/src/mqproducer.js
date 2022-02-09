var amqp = require('amqplib/callback_api');


class MQProducerr {
    static connection;
    static channel;
    static async initializeConnection(){
        // return producer.connect(); //return Promise
        connection = await amqp.connect('amqps://uwpafgqx:BEs1jYgp8RkBYu6JsE9V5LlN8DOa3TNY@porpoise.rmq.cloudamqp.com/uwpafgqx', function(error0, connection) {});
        channel = await this.connection.createChannel();
        await this.channel.asserQueue("lista-correcao");
    }

    static async publishToMQ(messageToSend) {
        if(!channel) throw 'Connection not ready';
        await this.channel.sendToQueue("lista-correcao", Buffer.from(JSON.stringify(messageToSend)))

        console.log("publising to lista-correcao", messageToSend)
    }
}

module.exports = MQProducerr;
