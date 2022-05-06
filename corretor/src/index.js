const MQProducer = require('./kafkaproducer');
const MQConsumer = require('./kafkaconsumer');
const Corretor = require('../Corretor/client');
require('dotenv').config()

const client = new Corretor();


run();

async function run() {
    console.log("[INFO] - Conectando-se ao RabbitMQ");
    try {

        if(!process.env.TEMP_FOLDER_FULL_PATH){
            throw "O caminho para o diretório temporário não foi definido.";
        }

        const res = await client.post('admin/login', { email: process.env.API_ADMIN_EMAIL, password: process.env.API_ADMIN_PASSWORD });
        if (!res.ok) {
            console.log('[ERROR] - Não foi possivel conectar com o servidor', process.env.SERVER_BASE_URL)
            throw res
        }
        else {
            client.setToken(res.data.data.token);
            console.log('[OK] Servidor conectado');
        }

        await MQProducer.initializeConnection().catch(e => {
            console.error("[ERRO] Não foi possivel inicializar o corretor - RabbitMQ offline");
            throw e;
        });

        await MQConsumer.initializeConnection(client).catch(e => {
            console.error("[ERRO] Não foi possivel inicializar o corretor - RabbitMQ offline - subscriber");
            throw e;
        });
        console.log(`[OK] RabbitMQ conectado com ID ${process.env.HOSTNAME}`);

        await MQConsumer.run();
    } catch (e) {
        console.error("[ERROR] - ", e)
        process.exit(1);
    }
}
