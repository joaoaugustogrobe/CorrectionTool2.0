const Exercicio = require("../../models/Exercicio");

async function obter({userId, exercicioId}){
    if(!userId, !exercicioId) return false;

    const exercicio = await Exercicio.findById(exercicioId).populate("materia", "professor");
    if(!exercicio) return false;

    if(userId == exercicio.materia.professor) return true;

    return false;
}

async function salvar(payload){
    return this.obter(payload);
}

module.exports = {obter, salvar}