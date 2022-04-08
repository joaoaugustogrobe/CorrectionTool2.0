require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
var cors = require('cors')

// const MQConsumer = require("./kafkaconsumer");
const MQProducer = require('./kafkaproducer');
const MQConsumer = require('./kafkaconsumer');

var cookieParser = require('cookie-parser')



const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);

app.use(cors({
  credentials: true,
  origin: [process.env.CORS_ORIGIN_URI],
}))
app.use(cookieParser())
app.use(express.json());
app.use(routes);



run();

async function run(){
  //kafka
  // const mq = new MQProducer();
  console.log('[INFO] - Inicializando');

  console.log('[INFO] - Inicializando MQProducer');
  await MQProducer.initializeConnection().catch(e => {
    console.error("[ERRO] Não foi possivel inicializar o servidor - Kafka offline", e);
    process.exit(1);
  }).then(() => {
    console.log("[OK] MQProducer conectado")
  });

  console.log('[INFO] - Inicializando MQConsumer');
  await MQConsumer.initializeConnection().catch(e => {
    console.error("[ERRO] Não foi possivel inicializar o servidor - Kafka offline - subscriber", e);
    process.exit(1);
  }).then(() => {
    console.log("[OK] MQConsumer conectado");
  });

  console.log(`[INFO] - Conectando em mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`)
  await mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>console.log("[OK] Conectado ao banco de dados.")).catch(e => {
    console.error("[ERRO] Não foi possivel inicializar o servidor - Bando de dados offline", e);
    process.exit(1);
  })


  //servidor
  server.listen(3333, ()=>{
    console.log("[OK] Porta 3333 ativa")
  })

  server.on('error', (e) => {
    console.log("[ERRO] Não foi possivel inicializar o servidor - Porta pode estar em uso", e);
      setTimeout(() => {
        server.close();
        process.exit(1);
      }, 1000);
  });

  await MQConsumer.run();

}
