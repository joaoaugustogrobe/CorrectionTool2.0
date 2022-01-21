const Correcao = require('../models/Correcao');
const Resolucao = require('../models/Resolucao');
const Comentario = require('../models/Comentario');

module.exports = {
  async store(req, res) {
    const { user, comentarios, notaCorrecao } = req.body;
    const { resolucaoId } = req.params;

    try {
      if (await user.cannot("resolucao/obter", { resolucaoId })) throw "Permissão insuficiente";
      if (await user.cannot("correcao/criar", { resolucaoId })) throw "Permissão insuficiente";

      const resolucao = await Resolucao.findById(resolucaoId).populate("materia", "professor");

      const correcao = await Correcao.create({
        resulucao: resolucaoId,
        aluno: resolucao.aluno,
        exercicio: resolucao.exercicio,
        comentarios,
        notaCorrecao,
      });

      return res.status(200).send({
        status: "success",
        message: "Correção cadastrada",
        data: correcao
      });

    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
  },

  async salvarFeedback(req, res) {
    const { user, nota } = req.body;
    const { resolucaoId } = req.params;

    try {

      if (await user.cannot("resolucao/obter", { resolucaoId })) throw "Permissão insuficiente";
      if (await user.cannot("correcao/criar", { resolucaoId })) throw "Permissão insuficiente";

      let correcao = await Correcao.findOne({ resolucao: resolucaoId });
      if (correcao) {
        correcao.notaCorrecao = nota;
        await correcao.save();
      } else {
        const resolucao = await Resolucao.findById(resolucaoId);
        const exercicio = resolucao.exercicio;
        const aluno = resolucao.aluno;

        correcao = await Correcao.create({
          resolucao: resolucaoId,
          notaCorrecao: nota,
          aluno,
          exercicio,
        });
      }

    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
    return res.status(200).send({
      status: "success",
      message: "Nota salva com sucesso",
      data: {}
    });
  },


  async salvarFeedbackLinha(req, res) {
    const { user, comentario, linha } = req.body;
    const { resolucaoId } = req.params;


    try {

      if (await user.cannot("resolucao/obter", { resolucaoId })) throw "Permissão insuficiente";
      if (await user.cannot("comentario/criar", { resolucaoId })) throw "Permissão insuficiente";

      let comentarioObject = await Comentario.findOne({ resolucao: resolucaoId, linha });

      if (comentarioObject) {//editar
        if (comentario) {
          comentarioObject.comentario = comentario;
          await comentarioObject.save();
        } else {//excluir
          await comentarioObject.remove();
        }
      } else {//criar
        if (comentario) {
          const resolucao = await Resolucao.findById(resolucaoId);
          const exercicio = resolucao.exercicio;
          const aluno = resolucao.aluno
          comentarioObject = await Comentario.create({
            resolucao: resolucaoId,
            linha,
            comentario,
            aluno,
            exercicio,
          });
        }
      }

    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
    return res.status(200).send({
      status: "success",
      message: "Comentario salvo",
    });
  },


  async obterCorrecao(req, res) {
    const { user } = req.body;
    const { resolucaoId } = req.params;

    try {
      if (await user.cannot("resolucao/obter", { resolucaoId })) throw "Permissão insuficiente";
      if (await user.cannot("correcao/obter", { resolucaoId })) throw "Permissão insuficiente";

      const comentarios = await Comentario.find({ resolucao: resolucaoId });
      let correcao = await Correcao.findOne({ resolucao: resolucaoId }) || {};

      return res.status(200).send({
        status: "success",
        message: "Notas obtidas",
        data: { comentarios, correcao }
      });



    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
  },

  async function(req, res) {
    try {

    } catch (e) {
      return res.status(400).send({ status: "error", message: e, data: null });
    }
    return res.status(200).send({
      status: "success",
      message: "Notas obtidas",
      data: {}
    });
  },
};
