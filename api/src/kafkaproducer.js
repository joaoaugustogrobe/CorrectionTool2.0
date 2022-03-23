var amqp = require('amqplib');
require('dotenv').config()

const amqpConfig = {
    protocol: 'amqp',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
    hostname: process.env.QUEUE_HOST,
    username: process.env.QUEUE_USER,
    password: process.env.QUEUE_PASSWORD,
    port: process.env.QUEUE_PORT,
}

class MQProducer {
    static channel = null;
    static async initializeConnection(){
        // let connection = await amqp.connect('amqps://uwpafgqx:BEs1jYgp8RkBYu6JsE9V5LlN8DOa3TNY@porpoise.rmq.cloudamqp.com/uwpafgqx');
        const connection = await amqp.connect(amqpConfig);

        connection.on('error', (err) => {
            console.error(err);
            this.channel = null;
        });
        this.channel = await connection.createChannel();
        await this.channel.assertQueue("lista-correcao");
    }

    static async publishToMQ(messageToSend) {
        if(!this.channel){
            console.error('Connection not ready');
            await MQProducer.initializeConnection();
        }
        await this.channel.sendToQueue("lista-correcao", Buffer.from(messageToSend))

        console.log("publising to lista-correcao")
    }
}

module.exports = MQProducer;
