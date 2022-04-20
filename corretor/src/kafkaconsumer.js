//const Kafka = require("kafkajs").Kafka
var amqp = require('amqplib');
const DockerClient = require('./dockerController');
const MQProducer = require('./kafkaproducer');
require('dotenv').config()

const amqpConfig = {
    protocol: 'amqp',
    vhost: '/',
    authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
    hostname: process.env.RABBITMQ_HOST,
    username: process.env.RABBITMQ_USERNAME,
    password: process.env.RABBITMQ_PASSWORD,
    port: process.env.RABBITMQ_PORT,
}


class MQConsumer {
    static channel = null;
    static dockerClient;


    static async initializeConnection(client){
        this.dockerClient = new DockerClient(client);
        
        // let connection = await amqp.connect('amqps://uwpafgqx:BEs1jYgp8RkBYu6JsE9V5LlN8DOa3TNY@porpoise.rmq.cloudamqp.com/uwpafgqx');
        let connection = await amqp.connect(amqpConfig);

        connection.on('error', (err) => {
            console.error(err);
            this.channel = null;
        });
        
        this.channel = await connection.createChannel();
        await this.channel.assertQueue("lista-correcao");

        await MQProducer.initializeConnection();

        this.channel.prefetch(1); // consumir 1 evento por vez
    }

    static run() {
        if(!this.channel) throw 'Connection not ready';
        this.channel.consume('lista-correcao', async message => {
            const payload = JSON.parse(message.content.toString());
            console.log("[EVENT] - Comecando execução de exercício ");

            const correcao = await this.dockerClient.executarTeste(payload);
            const _correcao_inicio = correcao._correcao_inicio;
            const _correcao_final = correcao._correcao_final;
            
            console.log(`[EVENT] - Mensagem processada ${_correcao_final - _correcao_inicio}ms`);

            await MQProducer.publishToMQ(JSON.stringify({
                ...payload,
                ...correcao
            }));

            this.channel.ack(message);
        })
    }
}

module.exports = MQConsumer;





// const { Kafka } = require("kafkajs")





// const kafka = new Kafka({
//     "brokers": ["correctiontool20_kafka_1:9092"],
//     "clientId": "correction-tool-corrector-service"
// });

// const consumer = kafka.consumer({ "groupId": "group" });



// class MQConsumer {
//     static dockerClient;
//     static initializeConnection() {
//         return new Promise(async (resolve, reject) => {
//             this.dockerClient = new DockerClient();


//             await consumer.connect().catch(reject);
//             await consumer.subscribe({
//                 topic: "lista-correcao",
//                 fromBeginning: true
//             }).catch(reject);

//             consumer.on('consumer.connect', (e)=>{
//                 console.log("[INFO] - Conectado");
//             })

//             consumer.on('consumer.disconnect', (e)=>{
//                 console.error("[ERROR] - Desconectado", e);
//             })


//             resolve();
//         })
//     }

//     static run() { //return promisse
//         return consumer.run({
//             "eachMessage": async ({ topic, partition, message }) => {
                
//                 const payload = JSON.parse(message.value);
//                 console.log("[EVENT] - Comecando processamento")

//                 const correcao = await this.dockerClient.executarTeste(payload);


//                 const _correcao_inicio = correcao._correcao_inicio;
//                 const _correcao_final = correcao._correcao_final;
                
//                 console.log(`[EVENT] - Mensagem processada ${_correcao_final - _correcao_inicio}ms`);

//                 MQProducer.publishToMQ(JSON.stringify({
//                     ...payload,
//                     ...correcao
//                 }));


                
//             }
//         })
//     }
// }

// module.exports = MQConsumer;