const Resolucao = require("../models/Resolucao");
const Exercicio = require("../models/Exercicio");
const Teste = require("../models/Teste");
const FileController = require("./FileController")
const DockerController = require("./DockerController")
const TesteResolucao = require("../models/TesteResolucao");
const MQProducer = require('../kafkaproducer');
const { ObjectId } = require('mongodb');

const { getResolucao } = require('../Authorization/Gates/ResolucaoGate');

const fs = require("fs");
const path = require("path");
const Matricula = require("../models/Matricula");

module.exports = {

  //professor obter notas de determinada resolução
  async obterNotasResolucao(req, res) {
    const { user, role } = req.body;
    const { resolucaoId } = req.params;

    try {
      const permissao = await user.can("resolucao/obter", { resolucaoId });
      if (!permissao) throw "Permissão insuficiente";

      const resolucao = await Resolucao.findById(resolucaoId);

      let testes = await TesteResolucao.aggregate([
        { $match: { 'resolucao': ObjectId(resolucaoId) } },
        { $match: { 'versao': resolucao.tentativas } },
        { $sort: { 'updatedAt': 1 } },
        {
          $group: {
            _id: '$teste',
            // submissoes: { $push: "$$ROOT" },
            testeresolucao: { $last: "$$ROOT" },
          }
        },
        { $lookup: { from: "testes", localField: "_id", foreignField: "_id", as: "teste" } },
        { "$unwind": "$teste" },
        {
          $addFields: {
            'input': '$teste.input',
            'isPrivate': '$teste.isPrivate',
            'nome': '$teste.nome',
            'output': '$teste.output',
            'mensagemErro': '$teste.mensagemErro',
            'versao': '$testeresolucao.versao',
          }
        },
        { $project: { teste: 0 } }
      ]);

      testes = testes.map(teste => {
        return {
          ...teste,
          output: role === 'aluno' && teste.isPrivate ? '???' : teste.output,
          input: role === 'aluno' && teste.isPrivate ? teste.input.map(() => '???') : teste.input,
        };
      });


      if (!testes) {
        return res.status(200).send({
          status: "success",
          message: "Notas obtidas",
          data: {
            testes: []
          }
        });
      }

      return res.status(200).send({
        status: "success",
        message: "Notas obtidas",
        data: {
          testes
        }
      });

    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
  },

  async ObterNotasExercicio(req, res) {
    const { user } = req.body;
    const { exercicioId } = req.params;

    try {
      const permissao = await user.can("exercicio/obter", { exercicioId });
      if (!permissao) throw "Permissão insuficiente";

      const exercicio = await Exercicio.findById(exercicioId);

      resolucoes = await Matricula.aggregate(
        [
          {
            '$match': {
              'materia': new ObjectId(exercicio.materia)
            }
          }, {
            '$set': {
              'exercicio': new ObjectId(exercicio._id)
            }
          }, {
            '$lookup': {
              'from': 'alunos', 
              'let': {
                'matricula_aluno': '$aluno'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$_id', '$$matricula_aluno'
                      ]
                    }
                  }
                }, {
                  '$project': {
                    '_id': 1, 
                    'email': 1, 
                    'nome': 1
                  }
                }
              ], 
              'as': 'aluno'
            }
          }, {
            '$unwind': {
              'path': '$aluno'
            }
          }, {
            '$lookup': {
              'from': 'testes', 
              'let': {
                'matricula_aluno': '$aluno._id', 
                'matricula_exercicio': '$exercicio'
              }, 
              'pipeline': [
                {
                  '$match': {
                    '$expr': {
                      '$eq': [
                        '$$matricula_exercicio', '$exercicio'
                      ]
                    }
                  }
                }, {
                  '$lookup': {
                    'from': 'testeresolucaos', 
                    'as': 'testeresolucao', 
                    'let': {
                      'teste_id': '$_id'
                    }, 
                    'pipeline': [
                      {
                        '$match': {
                          '$expr': {
                            '$and': [
                              {
                                '$eq': [
                                  '$$matricula_aluno', '$aluno'
                                ]
                              }, {
                                '$eq': [
                                  '$$teste_id', '$teste'
                                ]
                              }
                            ]
                          }
                        },
                      }, {
                        '$sort': {
                          'updatedAt': 1
                        }
                      }, {
                        '$limit': 1
                      }
                    ]
                  }
                }, {
                  '$unwind': '$testeresolucao'
                }
              ], 
              'as': 'testes'
            }
          }
        ]
      );

      // let notas = [{
      //   aluno: {},
      //   testeresolucao: [{
      //       teste,
      //       isError,
      //       output,
      //       resolucao
      //     }],
      // }]

      // let notas = [{
      //   aluno: {},
      //   testes: [{
      //     _id,
      //     inputs: [],
      //     isPrivate,
      //     testeresolucao: {
      //       isError,
      //       output,
      //       resolucao
      //     }
      //   }],
      // }]





      return res.status(200).send({
        status: "success",
        message: "Notas obtidas",
        data: {
          resolucoes
        }
      });

    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }



  },
}