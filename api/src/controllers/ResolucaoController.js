const Resolucao = require("../models/Resolucao");
const Exercicio = require("../models/Exercicio");
const Teste = require("../models/Teste");
const Correcao = require("../models/Correcao");
const Comentario = require("../models/Comentario");
const FileController = require("./FileController")
const DockerController = require("../controllers/DockerController")
const MQProducer = require('../kafkaproducer');
const { ObjectId } = require('mongodb');

const Storage = require('../services/Storage');

const fs = require("fs");
const path = require("path");

module.exports = {
  async store(req, res) {
    const { userId, exercicioId, comentarios } = req.body;
    //Validação
    let resolucao, exercicio, prazoDiff, prazoString;
    let filename, originalname;
    try {
      if (!req.file) throw "É necessario fazer o upload de um arquivo.";
      filename = req.file.filename;
      originalname = req.file.originalname;

      exercicio = await Exercicio.findById(exercicioId).populate('materia');
      if (!exercicio) throw "Exercício inexistente.";
      if (!exercicio.status) throw "Matéria desabilitada";

      const tempPath = path.resolve(req.file.destination);

      //Validar assinatura
      const file = Storage.read(tempPath, filename);
      const _space = '[\\s]*';
      const assinatura = exercicio.assinatura || [];
      const nomeFuncao = exercicio.nomeFuncao;
      const _reg = nomeFuncao+_space+'\\('+_space+assinatura.join('[\\s]*,[\\s]*')+_space+'\\)'
      const assinaturaValida = file.match(new RegExp(_reg, 'g'));
      if(!assinaturaValida) throw "Assinatura inválida";

      const pathDefinitivo = Storage.gerarDiretorio(
        exercicio.materia._id,
        exercicio._id,
        userId
      );

      Storage.mover(tempPath, pathDefinitivo, filename, originalname);


      // prazoDiff = Date.now() - exercicio.prazo;
      // if (prazoDiff > 0) throw "Submissão atrasada.";

      //-----
      //Salvar arquivo
      resolucao = await Resolucao.findOne({
        aluno: userId,
        exercicio: exercicioId,
      });

      if (resolucao) {
        const feedbackProfessor = await Correcao.findOne({resolucao: resolucao._id});
        console.log(feedbackProfessor)
        const comentariosProfessor = await Comentario.findOne({resolucao: resolucao._id});
        console.log(comentariosProfessor)
        if(feedbackProfessor || comentariosProfessor) throw "Resolução já corrigida.";

        resolucao.tentativas++;
        console.log('corrigindo resolucao, tentativas:', resolucao.tentativas);
        resolucao.dataSubmissao = Date.now();
        resolucao.resolucaoFilename = originalname;
        resolucao.status = 'pendente';
        resolucao.comentarios = comentarios;

        console.log('resolucao existente, sobrescrevendo')
        await resolucao.save();
      } else {
        resolucao = await Resolucao.create({
          exercicio: exercicioId,
          aluno: userId,
          resolucaoFilename: originalname,
          dataSubmissao: Date.now(),
          materia: exercicio.materia,
          comentarios,
        });
        exercicio.submissoesCount++;
        await exercicio.save()
      }

      prepararCorrecao(resolucao);

    } catch (e) {
      if (req.file)
      Storage.deletarArquivo(path.resolve(req.file.destination, filename));
      // Storage.deletarArquivo(path.resolve(pathDefinitivo, originalname));

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
      ).populate("aluno", "nome _id");
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
      } else if(role == "professor"){
        if (userId != resolucao.exercicio.materia.professor)
          throw "Resolução não pertence a um exercício desse professor.";
      }

      filePath = Storage.gerarDiretorio(
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
        ext: '.m',
        horarioAgendamento: Date.now(),
      }));
    })

  } catch (error) {
    console.error(error)
    throw error
  }
  return json
}