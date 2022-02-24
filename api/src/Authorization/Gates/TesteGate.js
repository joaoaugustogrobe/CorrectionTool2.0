const Teste = require("../../models/Teste");

async function obter({ userId, testeId }) {
	if (!userId, !testeId) return false;

	const teste = await Teste.findById(testeId).populate({
		path: 'exercicio',
		populate: {
			path: 'materia'
		}
	})

	if (!teste) return false;

	if (userId == teste.exercicio.materia.professor) return true;

	return false;
}

async function salvar(payload) {
	return this.obter(payload);
}

module.exports = { obter, salvar }