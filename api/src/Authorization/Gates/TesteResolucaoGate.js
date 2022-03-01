const TesteResolucao = require("../../models/TesteResolucao");


async function salvar({ userId, testeResolucaoId }) {
	if (!userId, !testeResolucaoId) return false;

	const testeResolucao = await TesteResolucao.findById(testeResolucaoId).populate({
		path: 'exercicio',
		populate: {
			path: 'materia'
		}
	})

	if (!testeResolucao) return false;

	if (userId == testeResolucao.exercicio.materia.professor) return true;

	return false;
}

module.exports = { salvar };