const Exercicio = require("../../models/Exercicio");
const Materia = require("../../models/Materia");

async function obter({userId, exercicioId}){
    if(!userId, !exercicioId) return false;

    const exercicio = await Exercicio.findById(exercicioId).populate("materia", "professor");
    if(!exercicio) return false;

    if(userId == exercicio.materia.professor) return true;

    return false;
}

async function criar({userId, materiaId}){
    if(!userId, !materiaId) return false;

    const materia = await Materia.findById(materiaId);
    if(!materia) return false;
    if(!materia.status) return false;

    if(userId == materia.professor) return true;

    return false;
}

async function salvar({userId, exercicioId}){
    if(!userId, !exercicioId) return false;

    const exercicio = await Exercicio.findById(exercicioId).populate("materia", "professor status");
    if(!exercicio) return false;
    if(!exercicio.materia.status) return false;

    if(userId == exercicio.materia.professor) return true;

    return false;
}

module.exports = {obter, salvar, criar}