const MQProducer = require('./kafkaproducer');
const MQConsumer = require('./kafkaconsumer');
// import Corretor from '../Corretor/client.js';
const Corretor = require('../Corretor/client');
require('dotenv').config()

const client = new Corretor();


run();

async function run() {
    console.log("[INFO] - Conectando-se ao Kafka");
    try {

        const res = await client.post('admin/login', { email: process.env.CLIENT_EMAIL, password: process.env.CLIENT_PASSWORD });
        if (!res.ok) throw `Não foi possivel conectar com o servidor - ${res}`
        else {
            client.setToken(res.data.data.token);
            console.log('[OK] Servidor conectado');
        }

        await MQProducer.initializeConnection().catch(e => {
            console.error("[ERRO] Não foi possivel inicializar o corretor - Kafka offline", e);
        });

        await MQConsumer.initializeConnection(client).catch(e => {
            console.error("[ERRO] Não foi possivel inicializar o corretor - Kafka offline - subscriber", e);
        });
        console.log("[OK] Kafka conectado");

        await MQConsumer.run();
    } catch (e) {
        console.error("[ERROR] - ", e)
    }
}