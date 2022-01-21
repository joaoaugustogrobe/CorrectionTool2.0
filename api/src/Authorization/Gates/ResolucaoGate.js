const Resolucao = require("../../models/Resolucao");

async function obter({userId, resolucaoId}){
    console.log("resolucao.obter", userId, resolucaoId);
    if(!userId, !resolucaoId) return false;

    const resolucao = await Resolucao.findById(resolucaoId).populate("materia", "professor");
    console.log(resolucao)
    if(!resolucao) return false

    if(userId == resolucao.materia.professor) return true;
    if(userId == resolucao.aluno) return true;

    return false;
}

module.exports = {obter}