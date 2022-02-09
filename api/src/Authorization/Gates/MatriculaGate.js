const Matricula = require("../../models/Matricula");
const Materia = require("../../models/Materia");

//Aluno matriculado e professor da matéria
async function deletar({ userId, materiaId, alunoId }) {
    console.log("matricula.deletar", userId, materiaId);
    if (!userId, !materiaId) return false;

    const materia = await Materia.findById(materiaId);
    if (!materia) return false;

    const matricula = await Matricula.find({ materia: materiaId, aluno: alunoId });
    if (!matricula) return false;


    if (materia.professor == userId) { //professor
        return true;
    } else if (userId === alunoId) { //aluno
        return true;
    }

    return false;
}

module.exports = { deletar }