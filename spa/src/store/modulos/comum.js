import Vue from 'vue';
import CorrectionTool from '../../../CorrectionTool/client.js';
import _ from 'lodash';


export default {
	namespaced: true,
	state: {
		client: new CorrectionTool(),
		feedbackResolucao: {},
		materias: {},
		testes: {},
		resolucaoTeste: {},//resolucaoTeste[resolucaoId] = [],
	},
	mutations: {
		set: (state, payload) => {
			Object.keys(payload).forEach(key => {
				Vue.set(state, key, payload[key]);
			});
		},
		guardarFeedback: (state, payload) => {
			const { feedback, resolucaoId } = payload;

			Vue.set(state.feedbackResolucao, resolucaoId, feedback);
		},
		salvarComentario: (state, payload) => {
			const { comentario, resolucaoId, linha } = payload;

			Vue.set(state.feedbackResolucao[resolucaoId].comentarios, linha, { ...state.feedbackResolucao[resolucaoId][linha], comentario });
		},
		guardarMateria: (state, payload) => {
			const { materia, materiaId } = payload;

			Vue.set(state.materias, materiaId, materia);
		},
		guardarTestesExercicio: (state, payload) => { //Teste, associado a um exercicio
			const { testes, exercicioId } = payload;

			Vue.set(state.testes, exercicioId, testes);
		},
		deletarTesteExercicio: (state, { testeId, exercicioId }) => {
			let testes = state.testes[exercicioId];
			const testeIndex = _.findIndex(testes, { _id: testeId });
			if (testeIndex >= 0) {
				Vue.delete(state.testes[exercicioId], testeIndex);
			}
		},
		criarTesteExercicio: (state, { teste, exercicioId }) => {
			let testes = state.testes[exercicioId];
			testes.push(teste);
			Vue.set(state.testes, exercicioId, testes);
		},
		salvarTesteExercicio: (state, payload) => {
			const { teste, exercicioId } = payload;
			const testeIndex = _.findIndex(state.testes[exercicioId], { _id: teste._id });
			if (testeIndex >= 0)
				Vue.set(state.testes[exercicioId], testeIndex, teste);
		},
		guardarResolucaoTeste: (state, payload) => { //Relação entre teste e resolução
			const { testes, resolucaoId } = payload;

			Vue.set(state.resolucaoTeste, resolucaoId, testes);
		},
	},
	actions: {
		async downloadFeedback(context, resolucaoId) {
			const req = await context.state.client.get(`correcao/${resolucaoId}`);

			if (req.ok) {
				let comentarios = req.data.comentarios;
				const comentariosPorLinha = {};
				comentarios.forEach(comentario => {
					comentariosPorLinha[comentario.linha] = comentario;
				});

				context.commit('guardarFeedback', { resolucaoId, feedback: { comentarios: comentariosPorLinha, correcao: req.data.correcao } });
			} else {
				context.commit("core/showMessage", {
					content: "Falha ao baixar comentarios!",
					error: true
				}, { root: true });
			}

			return req;
		},
		async downloadTemplate(context, { filename, template }) {
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(template));
			element.setAttribute('download', `${filename}.m`);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
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

		async obterTestesExercicio(context, payload) {
			const { exercicioId } = payload;
			const req = await context.state.client.get(`exercicio/${exercicioId}/testes`);

			if (req.ok) {
				context.commit("comum/guardarTestesExercicio", { exercicioId, testes: req.data.testes }, { root: true });
			} else {
				context.commit("core/showMessage", {
					content: "Falha ao obter testes!",
					error: true
				}, { root: true });
			}
		},
		async salvarTeste(context, payload) {

			const req = await context.state.client.post('testes/salvar', { ...payload, testeId: payload._id, exercicioId: payload.exercicio });

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

		async deletarTeste(context, { testeId, exercicioId }) {
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
		},

		async obterDadosExecucao(context, resolucaoId) {
			const req = await context.state.client.get(`resolucao/testes/${resolucaoId}`);


			context.commit('guardarResolucaoTeste', {
				resolucaoId,
				testes: req.data.testes
			});
		},

		async downloadSubmissao(context, submissaoId) {
			const req = await context.state.client.getPlain(`resolucao/${submissaoId}/download`);
			return req;
		},


	},
	getters: {
		obterComentarios: state => resolucaoId => {
			return state.feedbackResolucao[resolucaoId] && state.feedbackResolucao[resolucaoId].comentarios || {};
		},
		correcao: state => resolucaoId => {
			return state.feedbackResolucao[resolucaoId] && state.feedbackResolucao[resolucaoId].correcao || {};
		},
		obterMateria: state => materiaId => {
			return state.materias[materiaId] || null;
		},
		obterMaterias: state => {
			return _.values(state.materias);
		},
		obterTestes: state => exercicioId => {
			return state.testes[exercicioId] || [];
		},
		obterResolucaoTeste: state => resolucaoId => {
			return state.resolucaoTeste[resolucaoId] || {};
		}
	}
};
