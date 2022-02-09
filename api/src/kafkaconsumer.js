const { Kafka } = require("kafkajs");
const ResolucaoController = require("./controllers/ResolucaoController");
const ResolucaoTeste = require("./services/ResolucaoTeste");

var amqp = require('amqplib');




const kafka = new Kafka({
    "clientId": "correction-tool-api-service",
    "brokers": ["correctiontool20_kafka_1:9092"]
})

const consumer = kafka.consumer({ "groupId": "kafka" })



class MQConsumer {
    static channel = null;

    static async initializeConnection(){
        let connection = await amqp.connect('amqps://uwpafgqx:BEs1jYgp8RkBYu6JsE9V5LlN8DOa3TNY@porpoise.rmq.cloudamqp.com/uwpafgqx');
        this.channel = await connection.createChannel();
        await this.channel.assertQueue("lista-correcao-resposta");

        this.channel.prefetch(1); // consumir 1 evento por vez
    }

    static run(){ //return promisse
        if(!this.channel) throw 'Connection not ready';
        
        this.channel.consume('lista-correcao-resposta', async message => {
            console.log(`[EVENT] Processando resposta`)
      
            const payload = JSON.parse(message.content.toString());
            await ResolucaoTeste.armazenarOutput(payload);

            this.channel.ack(message);
        });
    }
}

module.exports = MQConsumer;