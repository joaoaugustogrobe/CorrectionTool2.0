var amqp = require('amqplib');


class MQProducer {
    static channel = null;
    static async initializeConnection(){
        // return producer.connect(); //return Promise
        let connection = await amqp.connect('amqps://uwpafgqx:BEs1jYgp8RkBYu6JsE9V5LlN8DOa3TNY@porpoise.rmq.cloudamqp.com/uwpafgqx');
        connection.on('error', (err) => {
            console.error(err);
            this.channel = null;
        });

        this.channel = await connection.createChannel();
        await this.channel.assertQueue("lista-correcao-resposta");
    }

    static async publishToMQ(messageToSend) {
        if(!this.channel){
            console.error('Connection not ready');
            await MQProducer.initializeConnection();
        }
        await this.channel.sendToQueue("lista-correcao-resposta", Buffer.from(messageToSend))

        console.log("publising to lista-correcao-resposta", messageToSend)
    }
}

module.exports = MQProducer;
