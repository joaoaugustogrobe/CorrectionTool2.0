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
  origin: process.env.CORS_ORIGIN_URI
}))
app.use(cookieParser())
app.use(express.json());
app.use(routes);



run();

async function run(){
  //kafka
  // const mq = new MQProducer();
  console.log('[INFO] - Inicializando')
  await MQProducer.initializeConnection().catch(e => {
    console.error("[ERRO] Não foi possivel inicializar o servidor - Kafka offline", e);
  })
  console.log("[OK] Kafka conectado")

  await MQConsumer.initializeConnection().catch(e => {
    console.error("[ERRO] Não foi possivel inicializar o servidor - Kafka offline - subscriber", e);
  });


  // //banco de dados
  // // await mongoose.connect(`mongodb+srv://root:root@cluster0.w6op8.mongodb.net/teste?retryWrites=true&w=majority`, {
  // await mongoose.connect(`mongodb://root:example@localhost:27017/test?authSource=admin`).catch(e => {
  //   console.error("[ERRO] Não foi possivel inicializar o servidor - Database offline", e);
  // })
  // console.log("[OK] Banco de dados conectado")
  console.log(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`)
  await mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?authSource=admin`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>console.log("Conectado ao banco de dados.")).catch(err => console.error(err))




  //servidor
  server.listen(3333, ()=>{
    console.log("[OK] Porta 3333 ativa")
  })

  server.on('error', (e) => {
    console.log("[ERRO] Não foi possivel inicializar o servidor - Porta pode estar em uso", e);
      setTimeout(() => {
        server.close();
        server.listen(3333);
      }, 1000);
  });

  await MQConsumer.run();

}
