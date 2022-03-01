const Resolucao = require("../models/Resolucao");
const Exercicio = require("../models/Exercicio");
const Teste = require("../models/Teste");
const FileUploadController = require("./FileUploadController");
const FileController = require("./FileController")
const DockerController = require("../controllers/DockerController")
const MQProducer = require('../kafkaproducer');
const { ObjectId } = require('mongodb');


const fs = require("fs");
const path = require("path");

module.exports = {
  async store(req, res) {
    const { userId, exercicioId } = req.body;
    //Validação
    let resolucao, exercicio, prazoDiff, prazoString;
    try {
      if (!req.file) throw "É necessario fazer o upload de um arquivo.";
      const { filename, originalname } = req.file;
      console.log("exercicioId", exercicioId);
      exercicio = await Exercicio.findById(exercicioId).populate('materia');
      console.log(exercicio);
      if (!exercicio) throw "Exercício inexistente.";
      if (!exercicio.status) throw "Matéria desabilitada";

      // prazoDiff = Date.now() - exercicio.prazo;
      // if (prazoDiff > 0) throw "Submissão atrasada.";

      //-----
      //Salvar arquivo
      resolucao = await Resolucao.findOne({
        aluno: userId,
        exercicio: exercicioId,
      });

      let tempPath, definitivoPath;
      tempPath = path.resolve(req.file.destination, filename);
      definitivoPath = FileUploadController.gerarDiretorio(
        exercicio.materia,
        exercicio._id,
        userId
      );
      if (resolucao) {
        resolucao.tentativas++;
        resolucao.dataSubmissao = Date.now();
        resolucao.resolucaoFilename = originalname;
        resolucao.status = 'pendente';

        console.log('resolucao existente, sobrescrevendo')
        await resolucao.save();
      } else {
        resolucao = await Resolucao.create({
          exercicio: exercicioId,
          aluno: userId,
          resolucaoFilename: originalname,
          dataSubmissao: Date.now(),
          materia: exercicio.materia
        });
        exercicio.submissoesCount++;
        await exercicio.save()
      }
      console.log(tempPath, definitivoPath)
      FileUploadController.rename(tempPath, definitivoPath, originalname);
      console.log("Submetido! gerando execução")
      let correcao = await prepararCorrecao(resolucao)
    } catch (e) {
      if (req.file)
        fs.unlink(req.file.path, e => {
          console.log(e);
        });
      return res.status(400).send({ status: "error", message: e, data: null });
    }

    return res.status(200).send({
      status: "success",
      message: "Exercício submetido!!!",
      data: {
        resolucao: resolucao._id,
        tentativas: resolucao.tentativas,
        horarioSubmissao: resolucao.updatedAt,
        entrega: prazoString
      }
    });
  },
  async obterResolucoesDeExercicio(req, res) {
    const { exercicioId } = req.params;
    const { userId } = req.body;
    let exercicio, resolucoes;
    try {
      exercicio = await Exercicio.findById(exercicioId).populate(
        "materia",
        "professor"
      );
      if (exercicio.materia.professor != userId)
        throw "Materia não pertence a este professor";
      if (!exercicio) throw "Exercício inexistente.";

      resolucoes = await Resolucao.aggregate([
        {
          '$match': {
            'exercicio': ObjectId(exercicioId)
          }
        }, {
          '$lookup': {
            'from': 'comentarios',
            'localField': '_id',
            'foreignField': 'resolucao',
            'as': 'comentarios'
          }
        }, {
          '$set': {
            'comentarios': {
              '$size': '$comentarios'
            }
          }
        }, {
          '$lookup': {
            'from': 'correcaos',
            'localField': '_id',
            'foreignField': 'resolucao',
            'as': 'nota'
          }
        }, {
          '$unwind': {
            'path': '$nota',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$set': {
            'nota': '$nota.notaCorrecao'
          }
        }, {
          '$set': {
            'nota': {
              '$ifNull': [
                '$nota', 0
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'alunos',
            'localField': 'aluno',
            'foreignField': '_id',
            'as': 'aluno'
          }
        }, {
          '$unwind': {
            'path': '$aluno'
          }
        }, {
          '$project': {
            '_id': 1,
            'tentativas': 1,
            'dataSubmissao': 1,
            'status': 1,
            'exercicio': 1,
            'aluno._id': 1,
            'aluno.email': 1,
            'aluno.nome': 1,
            'resolucaoFilename': 1,
            'corrigido': 1,
            'createdAt': 1,
            'updatedAt': 1,
            'comentarios': 1,
            'nota': 1
          }
        }
      ]);


    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
    return res.status(200).send({
      status: "success",
      message: "Submissões obtidas!!!",
      data: { resolucoes }
    });
  },
  async obterResolucaoDeExercicio(req, res) {
    const { exercicioId } = req.params;
    const { userId } = req.body;
    let resolucao;
    try {
      resolucao = await Resolucao.findOne(
        { exercicio: exercicioId, aluno: userId },
        // "exercicio resolucaoFilename tentativas dataSubmissao status"
      );
    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
    return res.status(200).send({
      status: "success",
      message: "Submissões obtidas!!!",
      data: { resolucao }
    });
  },
  async download(req, res) {
    const { resolucaoId } = req.params;
    const { userId, role } = req.body;
    let resolucao, file, filePath;
    try {
      resolucao = await Resolucao.findById(resolucaoId)
        .populate({ path: 'exercicio', populate: { path: "materia", select: "professor" } })
      if (!resolucao) throw "Resolução Inexistente.";
      if (role == "aluno") {
        if (userId != resolucao.aluno)
          throw "Resolução não pertence a esse aluno.";
      } else {
        if (userId != resolucao.exercicio.materia.professor)
          throw "Resolução não pertence a um exercício desse professor.";
      }

      filePath = FileUploadController.gerarDiretorio(
        resolucao.exercicio.materia._id,
        resolucao.exercicio._id,
        resolucao.aluno
      );
      filePath = path.resolve(filePath, resolucao.resolucaoFilename)
    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
    res.download(filePath, resolucao.resolucaoFilename)
  }
};

async function fetchTestes(exercicioId) {
  try {
    let testes = await Teste.find({ exercicio: exercicioId }).populate("exercicio", "materia nomeFuncao")
    return testes
  } catch (error) {
    throw error
  }
}

async function prepararCorrecao(resolucao) {
  let json = {}
  try {
    let testes = await fetchTestes(resolucao.exercicio)
    //TODO: VALIDAR TESTES VAZIOS

    testes.forEach(teste => {
      MQProducer.publishToMQ(JSON.stringify({
        input: teste.input,
        materia: teste.exercicio.materia,
        exercicio: teste.exercicio._id,
        aluno: resolucao.aluno,
        resolucao: resolucao._id,
        teste: teste._id,
        nomeFuncao: teste.exercicio.nomeFuncao,
        versao: resolucao.tentativas,
      }));
    })
    // testes.forEach(teste => {

    //   DockerController.executarOperacao({
    //     teste,
    //     aluno: resolucao.aluno,
    //     materia: teste.exercicio.materia,
    //     exercicio: teste.exercicio._id
    //   })
    // })

  } catch (error) {
    console.error(error)
    throw error
  }
  return json
}


async function JSONFactory(testes, resolucao, operacao) {
  let materia = testes[0].exercicio.materia;
  let exercicio = testes[0].exercicio._id;
  let aluno = resolucao.aluno;

  let _parametroEntrada = {
    id: { aluno, materia, exercicio },
    operacao
  }


  if (operacao === 'comparar') {
    _parametroEntrada.parametros = [
      FileController.resolvePathInputs(materia, exercicio, testes),
      FileController.resolvePathOutput(materia, exercicio, aluno)
    ]

  } else if (operacao === 'executar') {
    _parametroEntrada.parametros = [
      FileController.resolvePathExercicio(materia, exercicio, aluno, resolucao.resolucaoFilename),
      FileController.resolvePathInputs(materia, exercicio, testes),
      FileController.resolvePathOutput(materia, exercicio, aluno)
    ]
  } else {
    throw "Operação indisponivel"
  }

  return _parametroEntrada

  //Esta parte estava criando o arquivo JSON. não necessario de acordo com mudanças de projeto
  //let pathJson = await FileController.resolvePathJson(materia, exercicio, aluno, _parametroEntrada)
  //return [pathJson, _parametroEntrada]
}