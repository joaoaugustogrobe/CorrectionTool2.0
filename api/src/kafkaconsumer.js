//const Kafka = require("kafkajs").Kafka
const { Kafka } = require("kafkajs");
const ResolucaoController = require("./controllers/ResolucaoController");
const ResolucaoTeste = require("./services/ResolucaoTeste");




const kafka = new Kafka({
    "clientId": "correction-tool-api-service",
    "brokers": ["correctiontool20_kafka_1:9092"]
})

const consumer = kafka.consumer({ "groupId": "kafka" })



class MQConsumer {
    static initializeConnection(){
        return new Promise(async (resolve, reject)=>{
            await consumer.connect().catch(reject);
            await consumer.subscribe({
                "topic": "lista-correcao-resposta",
            }).catch(reject);
            resolve();
        })
    }

    static run(){ //return promisse
        return consumer.run({
            "eachMessage": async ({topic, partition, message}) => {
                const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
                console.log(`[EVENT] ${prefix} ${message.value}`)
          
                const payload = JSON.parse(message.value);
                ResolucaoTeste.armazenarOutput(payload);
            }
        })
    }
}

module.exports = MQConsumer;