import Vue from 'vue';
import _ from 'lodash'

import CorrectionTool from '../../../CorrectionTool/client.js';

export default {
  namespaced: true,
  state: {
    client: new CorrectionTool(),
    exercicios: [],
    submissoes: {}, //submissoes[exercicioId] = []
    alunos: {},
  },
  mutations: {
    set: (state, payload) => {
      Object.keys(payload).forEach(key => {
        Vue.set(state, key, payload[key]);
      });
    },
    guardarSubmissoes: (state, payload) => {
      const { submissoes, exercicioId } = payload;

      Vue.set(state.submissoes, exercicioId, submissoes);
    },
    guardarAlunos: (state, payload) => {
      const { alunos, materiaId } = payload;

      Vue.set(state.alunos, materiaId, alunos);
    },
    guardarExercicio: (state, { exercicioId, exercicio }) => {
      const exercicioIndex = _.findIndex(state.exercicios, { _id: exercicioId });
      if (exercicioId === -1) return;
      Vue.set(state.exercicios, exercicioIndex, exercicio);
    },
    criarExercicio: (state, exercicio) => {
      let exercicios = state.exercicios;
      exercicios.push(exercicio);
      Vue.set(state, 'exercicios', exercicios);
    }
  },
  actions: {
    async init(context) {
      context.dispatch("obterExercicios");
      // console.log("INIT");
      // context.dispatch("obterMateria", {
      // 	materiaId: this.exercicio.materia._id,
      // });
    },
    async obterSubmissoes(context, payload) {
      const { exercicioId } = payload;
      const req = await context.state.client.get(`resolucoes/${exercicioId}`);

      if (req.ok) {
        context.commit('guardarSubmissoes', {
          exercicioId,
          submissoes: req.data.resolucoes
        });
      }
    },
    async obterTestesExercicio(context, payload) {
      const { exercicioId } = payload;
      const req = await context.state.client.get(`exercicio/${exercicioId}/testes`);

      if (req.ok) {
        context.commit("professor/guardarTestesExercicio", { exercicioId, testes: req.data.testes }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao obter testes!",
          error: true
        }, { root: true });
      }

    },
    async salvarComentario(context, payload) {
      const { resolucaoId } = payload;
      const req = await context.state.client.post(`correcao/linefeedback/${resolucaoId}`, payload);
      if (req.ok) {
        context.commit("comum/salvarComentario", payload, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar comentario!",
          error: true
        }, { root: true });
      }
      return req;
    },
    async salvarNota(context, payload) {
      const { resolucaoId } = payload;
      const req = await context.state.client.post(`correcao/feedback/${resolucaoId}`, payload);
      if (req.ok) {
        //context.commit("comum/salvarComentario", payload, { root: true });
        context.commit("core/showMessage", {
          content: "Nota salva!",
          error: false
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar nota!",
          error: true
        }, { root: true });
      }
      return req;
    },
    async obterExercicios(context) {
      const req = await context.state.client.get(`exercicios`);
      if (req.ok) {
        context.commit('set', {
          exercicios: req.data.exercicios
        });
      }
    },

    async downloadFeedback(context, submissaoId) {
      const req = await context.state.client.get(`correcao/${submissaoId}`);
      return req;
    },


    async obterAlunosMateria(context, materiaId) {
      const req = await context.state.client.get(`${materiaId}/alunos`);

      if (req.ok) {
        context.commit('guardarAlunos', {
          materiaId,
          alunos: req.data.alunos,
        });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao obter alunos",
          error: true
        }, { root: true });
      }
    },

    async expulsarAluno(context, { aluno, materia }) {
      const req = await context.state.client.post('matricula/deletar', {
        alunoId: aluno._id,
        materiaId: materia._id,
      });

      if (req.ok) {
        context.commit("core/showMessage", {
          content: "Aluno expulso com sucesso!",
          error: false
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao expulsar aluno",
          error: true
        }, { root: true });
      }

      context.dispatch('obterAlunosMateria', materia._id);
    },
    async criarExercicio(context, payload) {
      const req = await context.state.client.post('exercicio/create', payload);

      if (req.ok) {
        context.commit('criarExercicio', req.data.data.exercicio);

        context.commit("core/showMessage", {
          content: "Exercício criado com sucesso!",
          error: false,
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar exercício!",
          error: true
        }, { root: true });
      }
      return req;
    },
    async salvarExercicio(context, { titulo, descricao, _id, prazo, visivel }) {
      const req = await context.state.client.post('exercicio/salvar', { titulo, descricao, exercicioId: _id, prazo, visivel });

      if (req.ok) {
        context.commit('guardarExercicio', {
          exercicioId: _id,
          exercicio: req.data.data.exercicio,
        });
        context.commit("core/showMessage", {
          content: "Exercício salvo com sucesso!",
          error: false,
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar matéria!",
          error: true
        }, { root: true });
      }

    },

    async atualizarTesteResolucao(context, {id, isError}) {
      const req = await context.state.client.post('testeresolucao/salvar', {testeResolucaoId: id, isError});

      if (req.ok) {
        context.dispatch('obterDadosExecucao', req.data.data.testeResolucao.resolucao)
        context.commit("core/showMessage", {
          content: "Dados atualizados com sucesso!",
          error: false,
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar dados!",
          error: true
        }, { root: true });
      }

      return req;
    }
  },
  getters: {
    obterSubmissoesExercicio: state => exercicioId => {
      return state.submissoes[exercicioId] || [];
    },
    obterTodasSubmissoesExercicio: (state, getters, globalState, globalGetters) => (exercicioId, materiaId) => {
      const materia = globalGetters['comum/obterMateria'](materiaId);
      if (!materia) return [];

      const alunos = materia.alunos;
      let submissoes = state.submissoes[exercicioId] || [];

      alunos.forEach(aluno => {
        const resolucaoSubmetida = _.find(submissoes, { aluno: { _id: aluno._id } });
        if (resolucaoSubmetida) return;

        submissoes.push({
          aluno,
          comentarios: 0,
          corrigido: false,
          exercicio: exercicioId,
          nota: 0,
          status: "nao-entregue",
          tentativas: 0,
        });
      })
      return submissoes;
    },
    obterExercicio: state => exercicioId => {
      return _.find(state.exercicios, { _id: exercicioId }) || {};
    },
    obterAlunos: state => materiaId => {
      return state.alunos[materiaId] || [];
    },
  }
};
