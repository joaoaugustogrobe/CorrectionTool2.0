import Vue from 'vue';
import _ from 'lodash'

import CorrectionTool from '../../../CorrectionTool/client.js';

export default {
  namespaced: true,
  state: {
    client: new CorrectionTool(),
    exercicios: [],
    submissoes: {}, //submissoes[exercicioId] = []
    resolucaoTeste: {},//resolucaoTeste[resolucaoId] = [],
    materias: {},
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
    guardarMateria: (state, payload) => {
      const { materia, materiaId } = payload;

      Vue.set(state.materias, materiaId, materia);
    },
    guardarResolucaoTeste: (state, payload) => {
      const { testes, resolucaoId } = payload;

      Vue.set(state.resolucaoTeste, resolucaoId, testes);
    }
  },
  actions: {
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
    async obterMateria(context, payload){
      const { materiaId } = payload;
      const req = await context.state.client.get(`materia/${materiaId}/show`);
      
      if (req.ok) {
        context.commit('guardarMateria', {
          materiaId,
          materia: req.data
        });
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
    async salvarNota(context, payload){
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
    async downloadSubmissao(context, submissaoId) {
      const req = await context.state.client.getPlain(`resolucao/${submissaoId}/download`);
      return req;
    },

    async downloadFeedback(context, submissaoId) {
      const req = await context.state.client.get(`correcao/${submissaoId}`);
      return req;
    },

    async obterDadosExecucao(context, resolucaoId) {
      const req = await context.state.client.get(`resolucao/testes/${resolucaoId}`);

      context.commit('guardarResolucaoTeste', {
        resolucaoId,
        testes: req.data.testes
      });
    },
  },
  getters: {
    obterSubmissoesExercicio: state => exercicioId => {
      return state.submissoes[exercicioId] || [];
    },
    obterExercicio: state => exercicioId => {
      return _.find(state.exercicios, { _id: exercicioId }) || {};
    },
    obterMateria: state => materiaId => {
      return state.materias[materiaId] || null;
    }
  }
};
