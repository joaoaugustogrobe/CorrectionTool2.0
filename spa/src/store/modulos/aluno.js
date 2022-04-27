import Vue from 'vue';
import CorrectionTool from '../../../CorrectionTool/client.js';
import _ from 'lodash';


export default {
	namespaced: true,
	state: {
		client: new CorrectionTool(),
		feedbackResolucao: {},
		exercicios: {},
		resolucoes: {},
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
		guardarExerciciosMateria: (state, payload) => {
			const { materiaId, exercicios } = payload;

			Vue.set(state.exercicios, materiaId, exercicios);
		},
		guardarResolucao: (state, payload) => {
			const { exercicioId, resolucao } = payload;

			Vue.set(state.resolucoes, exercicioId, resolucao);
		},
		guardarExercicio: (state, { exercicioId, exercicio }) => {
			const exercicioIndex = _.findIndex(state.exercicios, { _id: exercicioId });
			if (exercicioId === -1) return;
			Vue.set(state.exercicios, exercicioIndex, exercicio);
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

		async obterExerciciosMateria(context, materiaId) {
			const req = await context.state.client.get(`exercicio/show/${materiaId}`);

			if (req.ok) {
				context.commit('guardarExerciciosMateria', {
					materiaId,
					exercicios: req.data.exercicios
				});
			} else {
				context.commit("core/showMessage", {
					content: "Falha ao obter exercícios da matéria!",
					error: true
				}, { root: true });
			}
		},

		async obterResolucao(context, exercicioId) {
			const req = await context.state.client.get(`resolucao/${exercicioId}`);

			if (req.ok) {
				context.commit('guardarResolucao', {
					exercicioId,
					resolucao: { ...req.data.resolucao, ...(req.data.resolucao && { timestamp: new Date().getTime() }) }
				});
			} else {
				context.commit("core/showMessage", {
					content: "Falha ao obter resolução!",
					error: true
				}, { root: true });
			}

			return req;
		},

		async obterExercicio(context, exercicioId) {
			const req = await context.state.client.get(`${exercicioId}/show`);

			if (req.ok) {
				context.commit('guardarExercicio', {
					exercicioId,
					exercicio: req.data.exercicio
				});
			} else {
				context.commit("core/showMessage", {
					content: "Falha ao obter exercício!",
					error: true
				}, { root: true });
			}

		},


		async forgotPassword(context, email) {
			const req = await context.state.client.post('aluno/forgot_password', { email });

			if (req.ok) {
				context.commit("core/showMessage", {
					content: req.data.message,
					error: false
				}, { root: true });
			} else {
				context.commit("core/showMessage", {
					content: "Falha ao redefinir senha!",
					error: true
				}, { root: true });
			}
			return req;
		},

		async resetPassword(context, payload) {
			const req = await context.state.client.post('aluno/reset_password', payload);

			if (req.ok) {
				context.commit("core/showMessage", {
					content: req.data.message,
					error: false
				}, { root: true });
			} else {
				context.commit("core/showMessage", {
					content: req.data.message,
					error: true
				}, { root: true });
			}
			return req;
		},

		async submeterResolucao(context, payload) {
			// const {arquivoResolucao, comentarios, exercicioId} = payload;
			const req = await context.state.client.postMultipart("resolucao/submit", payload);
			if (req.ok) {
				const resolucao = context.getters.obterResolucao(payload.exercicioId);
				if (resolucao && resolucao._id) {
					context.commit('guardarResolucao', { 
						exercicioId: payload.exercicioId, 
						resolucao: { ...resolucao, status: 'pendente', corrigido: 'false' } 
					});
				}
			}
			return req;
		}
	},
	getters: {
		comentarios: state => resolucaoId => {
			return state.feedbackResolucao[resolucaoId] && state.feedbackResolucao[resolucaoId].comentarios || [];
		},
		correcao: state => resolucaoId => {
			return state.feedbackResolucao[resolucaoId] && state.feedbackResolucao[resolucaoId].correcao || {};
		},
		obterExerciciosMateria: state => materiaId => {
			return state.exercicios[materiaId] || [];
		},
		obterExercicio: (state, getters) => ({ materiaId, exercicioId }) => {
			const exercicios = getters['obterExerciciosMateria'](materiaId);
			const index = _.findIndex(exercicios, { _id: exercicioId });
			if (index > -1) return state.exercicios[materiaId][index];
			return {};
		},
		obterResolucao: (state) => (exercicioId) => {
			return state.resolucoes[exercicioId] || {};
		},
	}
};
