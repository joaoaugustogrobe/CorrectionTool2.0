// process.env.DEBUG = 'mongo-seeding';

// const { Seeder } = require('mongo-seeding');
// const fs = require('fs');



// const config = {
//     database: {
//         host: '127.0.0.1',
//         port: 27017,
//         name: 'testeee',
//         user: 'root',
//         password: 'example'
//     },
//     dropDatabase: true,
// };




// const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
// const {
//     ObjectId
// } = require('mongodb');

// run();


// async function run() {
//     MongoClient.connect(
//         'mongodb://root:example@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
//         { useNewUrlParser: true, useUnifiedTopology: true },
//         async function (connectErr, client) {
//             assert.equal(null, connectErr);


//             const alunos = client.db('local').collection('alunos');
//             alunosCollection = await fs.readFileSync('./data/1-alunos/alunos.json');
//             console.log(alunosCollection)

//             alunosCollection = JSON.parse(alunosCollection);
//             console.log(alunosCollection)
//             alunos.insertMany(alunosCollection)

//             // const coll = client.db('test').collection('matriculas');
//             // coll.aggregate(agg, (cmdErr, result) => {
//             //   assert.equal(null, cmdErr);
//             // });
//             client.close();
//         });
// }


const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs')
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://root:example@localhost:27017';
const client = new MongoClient(url);


// Database Name
const dbName = 'teste';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');

    await client.db('teste').dropDatabase();


    const alunos = client.db('teste').collection('alunos');
    alunosData = fs.readFileSync('./data/alunos.json');
    alunosData = await JSON.parse(alunosData);
    alunosData = alunosData.map(aluno => {
        return {
            ...aluno,
            _id: ObjectId(aluno._id['$oid'])
        }
    })
    await alunos.insertMany(alunosData);


    const professors = client.db('teste').collection('professors');
    professoresData = fs.readFileSync('./data/professors.json');
    professoresData = await JSON.parse(professoresData);
    professoresData = professoresData.map(professor => {
        return {
            ...professor,
            _id: ObjectId(professor._id['$oid'])
        }
    })
    await professors.insertMany(professoresData);




    const materias = client.db('teste').collection('materias');
    materiasData = fs.readFileSync('./data/materias.json');
    materiasData = await JSON.parse(materiasData);
    materiasData = materiasData.map(materia => {
        return {
            ...materia,
            _id: ObjectId(materia._id['$oid']),
            professor: ObjectId(materia.professor['$oid'])
        }
    })
    // console.log(materiasData[0])
    await materias.insertMany(materiasData);




    const exercicios = client.db('teste').collection('exercicios');
    exerciciosData = fs.readFileSync('./data/exercicios.json');
    exerciciosData = await JSON.parse(exerciciosData);
    exerciciosData = exerciciosData.map(exercicio => {
        return {
            ...exercicio,
            _id: ObjectId(exercicio._id['$oid']),
            materia: ObjectId(exercicio.materia['$oid'])
        }
    })
    // console.log(exerciciosData[0])
    await exercicios.insertMany(exerciciosData);




    const testes = client.db('teste').collection('testes');
    testesData = fs.readFileSync('./data/testes.json');
    testesData = await JSON.parse(testesData);
    testesData = testesData.map(teste => {
        return {
            ...teste,
            _id: ObjectId(teste._id['$oid']),
            exercicio: ObjectId(teste.exercicio['$oid'])
        }
    })
    // console.log(testesData[0])
    await testes.insertMany(testesData);



    const matriculas = client.db('teste').collection('matriculas');
    matriculasData = fs.readFileSync('./data/matriculas.json');
    matriculasData = await JSON.parse(matriculasData);
    matriculasData = matriculasData.map(matricula => {
        return {
            ...matricula,
            _id: ObjectId(matricula._id['$oid']),
            aluno: ObjectId(matricula.aluno['$oid']),
            materia: ObjectId(matricula.materia['$oid']),
        }
    })
    // console.log(matriculasData[0])
    await matriculas.insertMany(matriculasData);





    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());