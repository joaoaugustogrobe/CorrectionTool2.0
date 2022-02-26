import Vue from 'vue';
import CorrectionTool from '../../../CorrectionTool/client.js';


export default {
	namespaced: true,
	state: {
		client: new CorrectionTool(),
		feedbackResolucao: {},
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

			Vue.set(state.feedbackResolucao[resolucaoId].comentarios, linha, {...state.feedbackResolucao[resolucaoId][linha], comentario});
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

				context.commit('guardarFeedback', { resolucaoId, feedback: { comentarios: comentariosPorLinha, correcao: req.data.correcao} });
			} else {
				context.commit("core/showMessage", {
					content: "Falha ao baixar comentarios!",
					error: true
				}, { root: true });
			}

			return req;
		},
		async downloadTemplate(context, {filename, template}) {
			var element = document.createElement('a');
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(template));
			element.setAttribute('download', `${filename}.m`);
			element.style.display = 'none';
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		}
	},
	getters: {
		comentarios: state => resolucaoId => {
			return state.feedbackResolucao[resolucaoId] && state.feedbackResolucao[resolucaoId].comentarios || {};
		},
		correcao: state => resolucaoId => {
			return state.feedbackResolucao[resolucaoId] && state.feedbackResolucao[resolucaoId].correcao || {};
		},
	}
};
