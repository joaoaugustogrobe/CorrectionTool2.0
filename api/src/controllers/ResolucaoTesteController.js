const Resolucao = require("../models/Resolucao");
const Exercicio = require("../models/Exercicio");
const Teste = require("../models/Teste");
const FileUploadController = require("./FileUploadController");
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
    const { user } = req.body;
    const { resolucaoId } = req.params;

    try {
      const permissao = await user.can("resolucao/obter", { resolucaoId });
      if (!permissao) throw "Permissão insuficiente";

      let testes = await TesteResolucao.aggregate([
        { $match: { 'resolucao': ObjectId(resolucaoId) } },
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
          }
        },
        { $project: { teste: 0 } }
      ]);


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
      console.log(permissao)
      if (!permissao) throw "Permissão insuficiente";

      const exercicio = await Exercicio.findById(exercicioId);

      resolucoes = await Matricula.aggregate(


        [
          {
            '$match': {
              'materia': new ObjectId('613f9b04d45c820033ed8ce1')
            }
          }, {
            '$set': {
              'exercicio': new ObjectId('613f9c8fd45c820033ed8ce3')
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
                        }
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

      console.log(resolucoes)

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