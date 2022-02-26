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
    testes: {},
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
    guardarMateria: (state, payload) => {
      const { materia, materiaId } = payload;

      Vue.set(state.materias, materiaId, materia);
    },
    guardarResolucaoTeste: (state, payload) => { //Relação entre teste e resolução
      const { testes, resolucaoId } = payload;

      Vue.set(state.resolucaoTeste, resolucaoId, testes);
    },
    guardarTestesExercicio: (state, payload) => { //Teste, associado a um exercicio
      const { testes, exercicioId } = payload;

      Vue.set(state.testes, exercicioId, testes);
    },
    salvarTesteExercicio: (state, payload) => {
      const { teste, exercicioId } = payload;
      const testeIndex = _.findIndex(state.testes[exercicioId], { _id: teste._id });
      if (testeIndex >= 0)
        Vue.set(state.testes[exercicioId], testeIndex, teste);
    },
    deletarTesteExercicio: (state, { testeId, exercicioId }) => {
      let testes = state.testes[exercicioId];
      const testeIndex = _.findIndex(testes, { _id: testeId });
      if(testeIndex >= 0){
        Vue.delete(state.testes[exercicioId], testeIndex);
      }
    },
    criarTesteExercicio: (state, { teste, exercicioId }) => {
      let testes = state.testes[exercicioId];
      testes.push(teste);
      Vue.set(state.testes, exercicioId, testes);
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
    async obterMateria(context, payload) {
      const { materiaId } = payload;
      const req = await context.state.client.get(`materia/${materiaId}/show`);

      if (req.ok) {
        context.commit('guardarMateria', {
          materiaId,
          materia: req.data
        });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao obter matéria!",
          error: true
        }, { root: true });
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
    async criarExercicio(context, payload){
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
    async salvarMateria(context, { nome, senha, status, capacidade, materiaId }) {
      const payload = {
        materiaId,
        ...(nome && { nome }),
        ...(senha && { senha }),
        ...(capacidade && { capacidade }),
        ...(status !== undefined && { status }),
      };

      const req = await context.state.client.post('materia/salvar', payload);

      if (req.ok) {
        context.commit('guardarMateria', {
          materiaId,
          materia: req.data.data.materia
        });
        context.commit("core/showMessage", {
          content: "Matéria salva com sucesso!",
          error: false,
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar matéria!",
          error: true
        }, { root: true });
      }
    },

    async obterMaterias(context) {
      const req = await context.state.client.get('materia');

      if (req.ok) {
        const materias = req.data;

        materias.forEach(materia => {
          context.commit('guardarMateria', {
            materiaId: materia._id,
            materia: materia,
          });
        })
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar matéria!",
          error: true
        }, { root: true });
      }
    },

    async salvarTeste(context, payload) {

      const req = await context.state.client.post('testes/salvar', { ...payload, testeId: payload._id, exercicioId: payload.exercicio});

      if (req.ok) {
        context.commit('salvarTesteExercicio', {
          exercicioId: req.data.data.teste.exercicio,
          teste: req.data.data.teste
        });
        context.commit("core/showMessage", {
          content: "Teste salvo com sucesso!",
          error: false,
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao salvar teste!",
          error: true
        }, { root: true });
      }
    },

    async criarTeste(context, payload) {
      const req = await context.state.client.post('testes/create', payload);

      if (req.ok) {
        context.commit('criarTesteExercicio', {
          exercicioId: req.data.data.teste.exercicio,
          teste: req.data.data.teste
        });
        context.commit("core/showMessage", {
          content: "Teste criado com sucesso!",
          error: false,
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao criar teste!",
          error: true
        }, { root: true });
      }
    },

    async deletarTeste(context, {testeId, exercicioId}) {
      const req = await context.state.client.post('testes/deletar', { testeId });

      if (req.ok) {
        context.commit('deletarTesteExercicio', {
          exercicioId,
          testeId,
        });
        context.commit("core/showMessage", {
          content: "Teste deletado com sucesso!",
          error: false,
        }, { root: true });
      } else {
        context.commit("core/showMessage", {
          content: "Falha ao deletar teste!",
          error: true
        }, { root: true });
      }
    }
  },
  getters: {
    obterSubmissoesExercicio: state => exercicioId => {
      return state.submissoes[exercicioId] || [];
    },
    obterTodasSubmissoesExercicio: state => (exercicioId, materiaId) => {
      const materia = state.materias[materiaId];
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
    obterMateria: state => materiaId => {
      return state.materias[materiaId] || null;
    },
    obterTestes: state => exercicioId => {
      return state.testes[exercicioId] || [];
    },
    obterAlunos: state => materiaId => {
      return state.alunos[materiaId] || [];
    },
    obterMaterias: state => {
      return _.values(state.materias);
    }
  }
};
