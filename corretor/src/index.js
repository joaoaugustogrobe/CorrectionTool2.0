const MQProducer = require('./kafkaproducer');
const MQConsumer = require('./kafkaconsumer');


run();

async function run() {
    console.log("[INFO] - Conectando-se ao Kafka");
    try{

        await MQProducer.initializeConnection().catch(e => {
            console.error("[ERRO] Não foi possivel inicializar o servidor - Kafka offline", e);
        });
        
        await MQConsumer.initializeConnection().catch(e => {
            console.error("[ERRO] Não foi possivel inicializar o servidor - Kafka offline - subscriber", e);
        });
        console.log("[OK] Kafka conectado");
        
        await MQConsumer.run();
    }catch(e){
        console.error("[ERROR] - ", e)
    }
}