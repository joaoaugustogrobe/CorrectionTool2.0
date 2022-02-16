const Materia = require("../../models/Materia");

async function salvar({userId, materiaId}){
    if(!userId, !materiaId) return false;

    const materia = await Materia.findById(materiaId);
    if(!materia) return false;

    if(userId == materia.professor) return true;

    return false;
}

module.exports = {salvar}