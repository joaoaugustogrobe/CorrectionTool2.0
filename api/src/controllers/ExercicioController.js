const Materia = require("../models/Materia");
const Exercicio = require("../models/Exercicio");
const Matricula = require("../models/Matricula");


const { validationResult } = require('express-validator');
const {mapErrors} = require('../Validation/index');


module.exports = {
  async store(req, res) {
    const { materiaId, titulo, descricao, prazo, nota } = req.body;

    let materia, exercicio;

    try {
      if (!materiaId || !titulo || !descricao || !prazo || !nota)
        throw "Informações inválidas..";

      materia = await Materia.findById(materiaId);
      if (!materia) throw "Matéria inexistente.";
      if (materia.professor != req.body.userId)
        throw "Esta matéria não pertence a esse usuário.";

      exercicio = await Exercicio.create({
        titulo,
        descricao,
        prazo,
        nota,
        status: "pendente",
        materia: materiaId
      })
      exercicio = await exercicio.populate("materia", "nome").execPopulate()
    } catch (e) {
      return res.status(401).send({ status: "error", message: e, data: null });
    }
    return res.status(200).send({ status: "success", message: "Exercício cadastrado!!!", data: { exercicio } })
  },

  async exercicioShow(req, res) {
    const { exercicioId } = req.params

    let exercicio
    try {
      if (!exercicioId) throw "Informações inválidas..";

      exercicio = await Exercicio.findById(exercicioId).populate("materia", "nome")
      if (!exercicio) throw "Exercício inexistente."

      return res.status(200).send({ status: "success", message: "Exercício encontrado!!!", data: { exercicio } })
    } catch (e) {
      return res.status(401).send({ status: "error", message: e, data: null });
    }
  },
  async getExerciciosAluno(req, res) {
    const { userId } = req.body;
    let exercicios
    try {
      var id = require('mongodb').ObjectID(userId);

      exercicios = await Matricula.aggregate([
        { $match: { aluno: id } },
        { $project: { _id: 0, materia: 1 } },
        {
          $lookup: {
            "from": "exercicios",
            "localField": "materia",
            "foreignField": "materia",
            "as": "exercicio"
          }
        },
        { $unset: "materia" },
        { "$unwind": "$exercicio" },


      ]).sort({ "exercicio.prazo": 1 })
    } catch (error) {
      console.log(error)
      res.send(300)
    }
    res.send(exercicios)
  },
  async getExerciciosProfessor(req, res) {
    const { userId } = req.body;

    let exercicios
    try {

      var id = require('mongodb').ObjectID(userId);

      exercicios = await Exercicio.aggregate([{
        $lookup: {
          "from": "materias",
          "localField": "materia",
          "foreignField": "_id",
          "as": "materia"
        }
      }, //Mesmo que o populate(materia)
      { "$unwind": "$materia" }, //Tira matéria do array
      { $match: { "materia.professor": id } }, //Exercicio pertente a matéria do professor
      { $project: { _id: 1, titulo: 1, visivel: 1, descricao: 1, prazo: 1, submissoesCount: 1, "materia.nome": 1, "materia._id": 1 } } //Filtra apenas campos relevantes
      ])
      /*
      exercicios = await Exercicio.aggregate( [ { $group : { 
        _id : "$materia",
        nome: {$first: "$lookup"}
        }} 
      ])*/

      return res.status(200).send({ status: "success", message: "Exercícios encontrados!!!", data: { exercicios } })
    } catch (e) {
      return res.status(401).send({ status: "error", message: e, data: null });
    }
  },
  async getExerciciosMateria(req, res) {
    const { userId, role } = req.body;
    const materiaId = req.params.materiaId;

    let materia, exercicios, matricula
    try {
      if (!materiaId) throw "Informações inválidas..";
      materia = await Materia.findById(materiaId);
      if (!materia) throw "Matéria inexistente.";
      if (role == "professor")
        if (materia.professor != userId) throw "Esta matéria não pertence a esse usuário.";

      if (role == "aluno") {
        matricula = await Matricula.findOne({ aluno: userId, materia: materiaId })
        if (!matricula) throw "Usuário não esta matriculado nessa matéria.";
      }
      exercicios = await Exercicio.find({ materia: materiaId })
      return res.status(200).send({ status: "success", message: "Exercícios encontrados!!!", data: { exercicios } })

    } catch (e) {
      return res.status(401).send({ status: "error", message: e, data: null });
    }

  },

  async salvar(req, res) {
    const { user, titulo, descricao, exercicioId, prazo, visivel } = req.body;
    let exercicio;

    try {
      mapErrors(req).throw();
      if (await user.cannot("exercicio/salvar", { exercicioId })) throw "Permissão insuficiente";

      exercicio = await Exercicio.findById(exercicioId, '_id titulo visivel descricao prazo submissoesCount').populate("materia", "nome");

      exercicio.titulo = titulo;
      exercicio.descricao = descricao;
      exercicio.prazo = prazo;
      exercicio.visivel = visivel;
      await exercicio.save();

    }
    catch (e) {
      console.log(e);
      return res.status(401).send({ status: "error", message: e && typeof (e) === 'object' && e.array ? e.mapped() : e, data: null });

    }
    return res.status(200).send({ status: "success", message: "Exercício salvo!!!", data: { exercicio } })

  }
};
