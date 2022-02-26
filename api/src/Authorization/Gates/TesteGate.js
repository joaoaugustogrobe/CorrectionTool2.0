const Teste = require("../../models/Teste");
const Exercicio = require("../../models/Exercicio");

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

async function criar({ userId, exercicioId }) {
	if (!userId, !exercicioId) return false;

	const exercicio = await Exercicio.findById(exercicioId).populate("materia", "professor");
	console.log(exercicio);
	if (!exercicio) return false;

	if (exercicio.materia.professor == userId) return true;

	return false;
}

async function salvar(payload) {
	return this.obter(payload);
}

async function deletar(payload) {
	return this.obter(payload);
}

module.exports = { obter, salvar, criar, deletar };